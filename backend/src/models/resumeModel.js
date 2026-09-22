import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: { type: String, default: "" },
  role: { type: String, default: "" },
  duration: { type: String, default: "" },
  details: { type: String, default: "" },
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: "" },
  institute: { type: String, default: "" },
  year: { type: String, default: "" },
});

// Aligned keys with roadmap/analysis skillGap structure
const resumeSkillGapSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  currentScore: { type: Number, default: 0 },
  targetScore: { type: Number, default: 100 },
  baselineScore: { type: Number, default: 0 },
  suggestion: { type: String, default: "" }, // Optional: Per-skill dynamic recommendation
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Standardized model reference (User)
      required: true,
      index: true,
    },
    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      targetRole: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
    skills: [{ type: String }],
    experience: [experienceSchema],
    education: [educationSchema],
    analysisResult: {
      atsScore: { type: Number, default: 0 },
      extractedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      skillGap: [resumeSkillGapSchema],
      suggestions: [{ type: String }], // Root-level AI suggestions array
      analyzedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

const resumeModel =
  mongoose.models.resumes || mongoose.model("resumes", resumeSchema);

export default resumeModel;