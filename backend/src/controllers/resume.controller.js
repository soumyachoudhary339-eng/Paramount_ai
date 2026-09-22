import dotenv from "dotenv";
dotenv.config();

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

import { GoogleGenerativeAI } from "@google/generative-ai";
import resumeModel from "../models/resumeModel.js";
import RoadmapModel from "../models/roadmap.model.js";

// --- API KEY ROTATION SETUP ---
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY,
].filter(Boolean);

let currentKeyIndex = 0;

const getNextApiKey = () => {
  if (apiKeys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables.");
  }
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
};

// --- GENERATE WITH FALLBACK & ROTATION ---
const generateWithFallback = async (prompt) => {
  const modelCandidates = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

  let lastError = null;

  for (const modelName of modelCandidates) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const activeApiKey = getNextApiKey();
        const genAIInstance = new GoogleGenerativeAI(activeApiKey);

        const model = genAIInstance.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });

        const result = await model.generateContent(prompt);
        return result;
      } catch (err) {
        lastError = err;
        const status = err.status || 500;
        console.warn(`[Attempt ${attempt}] Model ${modelName} failed (${status}): ${err.message}`);

        if (status === 503 || status === 429) {
          const delay = attempt * 3000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
  }
  throw lastError;
};

// @desc    Analyze resume PDF and generate roadmap with dynamic degree-aware mapping
// @route   POST /api/resume/analyze-pdf
// @access  Private
export const analyzeResumePDF = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication context missing.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF document.",
      });
    }

    const { targetRole } = req.body;
    const finalRole = targetRole || "Full-Stack Developer";

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from the provided PDF file.",
      });
    }

    // --- DYNAMIC ACADEMIC/COURSE BACKGROUND DETECTION ---
    const lowerText = resumeText.toLowerCase();
    let academicContext = "General Technology Background";
    if (lowerText.includes("b.tech") || lowerText.includes("computer science") || lowerText.includes("bsc") || lowerText.includes("mca")) {
      academicContext = "Computer Science / Engineering Degree Graduate";
    } else if (lowerText.includes("mba") || lowerText.includes("business") || lowerText.includes("management")) {
      academicContext = "Management / Business Graduate";
    } else if (lowerText.includes("data science") || lowerText.includes("analytics") || lowerText.includes("statistics")) {
      academicContext = "Data Science / Analytics Specialization";
    }

    // --- ADVANCED DYNAMIC PROMPT ---
    const prompt = `
      Act as an elite ATS Expert and Senior Career Advisor.
      Perform a deep-dive analysis of the candidate's resume text below, keeping their academic background/degree (${academicContext}) and Target Role ("${finalRole}") in mind.

      Resume Content:
      """
      ${resumeText}
      """

      Instructions for Evaluation:
      1. Evaluate how well their specific degree coursework, certifications, and past projects align with "${finalRole}".
      2. Identify actual technical or professional skills present in the text ("extractedSkills").
      3. Identify critical skills missing for "${finalRole}" based on industry standards ("missingSkills").
      4. Create realistic skill gap metrics ("skillGap") where "currentScore" reflects their proficiency level, and "targetScore" is set to 100.
      5. CRITICAL: For EVERY skill listed in "missingSkills" or "skillGap", you MUST create a corresponding milestone in the "roadmap" array (e.g., if "Kubernetes" is in skillGap, include a milestone titled "Master Kubernetes"). Every skill gap must have a matching milestone so completing milestones resolves the gaps.
      6. Provide tailored suggestions that bridge the gap between their specific degree/courses and industry expectations.

      Return a valid JSON object matching this exact structure:
      {
        "atsScore": 75,
        "targetRole": "${finalRole}",
        "extractedSkills": ["React", "Node.js"],
        "missingSkills": ["Docker", "Kubernetes"],
        "skillGap": [
          { "skillName": "Docker", "currentScore": 30, "targetScore": 100 },
          { "skillName": "Kubernetes", "currentScore": 20, "targetScore": 100 }
        ],
        "suggestions": ["Add practical projects matching your coursework"],
        "roadmap": [
          { "title": "Master Docker", "status": "pending", "description": "Learn containerization fundamentals" },
          { "title": "Master Kubernetes", "status": "pending", "description": "Learn pod management and orchestration" }
        ]
      }
    `;

    const result = await generateWithFallback(prompt);

    let parsedAnalysis;
    try {
      const rawText = result.response.text();
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedAnalysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return res.status(500).json({ success: false, message: "Failed to parse AI response." });
    }

    // Fetch existing roadmap to retain previously saved baseline scores if re-analyzing
    const existingRoadmap = await RoadmapModel.findOne({ user: userId });
    const existingSkillsMap = new Map();
    if (existingRoadmap && existingRoadmap.skillGap) {
      existingRoadmap.skillGap.forEach((skill) => {
        if (skill.skillName) {
          existingSkillsMap.set(skill.skillName.toLowerCase(), skill);
        }
      });
    }

    const formattedSkillGap = (parsedAnalysis.skillGap || []).map((s, index) => {
      const resolvedName = s.skillName || s.name || `Skill ${index + 1}`;
      const existingSkill = existingSkillsMap.get(resolvedName.toLowerCase());

      const currentVal = Number(
        s.currentScore ?? s.current ?? s.currentLevel ?? existingSkill?.currentScore ?? 0
      );
      const targetVal = Number(
        s.targetScore ?? s.target ?? s.requiredLevel ?? existingSkill?.targetScore ?? 100
      );
      const baselineVal =
        existingSkill?.baselineScore !== undefined
          ? Number(existingSkill.baselineScore)
          : currentVal;

      return {
        skillName: resolvedName,
        currentScore: currentVal,
        targetScore: targetVal,
        baselineScore: baselineVal,
      };
    });

    const formattedMilestones = (parsedAnalysis.roadmap || []).map((m) => ({
      title: m.title || m.name || "Untitled Milestone",
      description: m.description || "",
      status: (m.status || "pending").toLowerCase(),
      targetDate: m.targetDate || null,
    }));

    parsedAnalysis.skillGap = formattedSkillGap;

    // 1. Save in Resume Model
    const updatedResume = await resumeModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          "personalInfo.targetRole": finalRole,
          skills: parsedAnalysis.extractedSkills,
          analysisResult: {
            atsScore: parsedAnalysis.atsScore,
            extractedSkills: parsedAnalysis.extractedSkills,
            missingSkills: parsedAnalysis.missingSkills,
            skillGap: formattedSkillGap,
            suggestions: parsedAnalysis.suggestions,
            analyzedAt: new Date(),
          },
        },
      },
      { returnDocument: "after", upsert: true }
    );

    // 2. Save / Update in Roadmap Model
    const savedRoadmap = await RoadmapModel.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        targetRole: finalRole,
        atsScore: parsedAnalysis.atsScore || 0,
        milestones: formattedMilestones,
        skillGap: formattedSkillGap,
        suggestions: parsedAnalysis.suggestions || [], // Fix added here
      },
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "PDF analyzed and roadmap generated successfully with dynamic background mapping!",
      data: {
        analysis: parsedAnalysis,
        savedResume: updatedResume,
        roadmap: savedRoadmap,
      },
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: "AI service is experiencing high traffic or quota limit. Please retry in a few seconds.",
      error: error.message,
    });
  }
};