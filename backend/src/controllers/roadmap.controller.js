import RoadmapModel from '../models/roadmap.model.js';
import Roadmap from '../models/roadmap.model.js'; // Agar default export hai

// @desc    Get current user's roadmap
// @route   GET /api/roadmap
// @access  Private
export const getRoadmap = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication failed.',
      });
    }

    const roadmap = await RoadmapModel.findOne({ user: userId });

    if (!roadmap) {
      return res.status(200).json({
        success: true,
        message: 'No roadmap generated yet.',
        data: {
          roadmap: {
            role: null,
            atsScore: 0,
            milestones: [],
            skillGap: [],
          },
        },
      });
    }

    // Unified payload mapping for frontend and database consistency
    return res.status(200).json({
      success: true,
      message: 'Roadmap retrieved successfully.',
      data: {
        roadmap: {
          id: roadmap._id,
          role: roadmap.targetRole,
          atsScore: roadmap.atsScore,
          milestones: (roadmap.milestones || []).map((m) => ({
            id: m._id,
            title: m.title,
            description: m.description,
            status: m.status,
            targetDate: m.targetDate,
          })),
          skillGap: (roadmap.skillGap || []).map((s) => ({
            skillName: s.skillName,
            currentScore: s.currentScore,
            targetScore: s.targetScore,
            baselineScore: s.baselineScore,
            // Aliases provided for backward compatibility if any legacy component expects them
            name: s.skillName,
            currentLevel: s.currentScore,
            requiredLevel: s.targetScore,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching roadmap.',
    });
  }
};
// @desc    Create or update roadmap (Preserves existing progress scores)
// @route   POST /api/roadmap
// @access  Private
export const createOrUpdateRoadmap = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { targetRole, atsScore, milestones, skillGap } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Target role is required.',
      });
    }

    // 1. Fetch existing roadmap to protect AI-analyzed scores
    const existingRoadmap = await RoadmapModel.findOne({ user: userId });
    const existingSkillsMap = new Map();
    if (existingRoadmap && existingRoadmap.skillGap) {
      existingRoadmap.skillGap.forEach((skill) => {
        if (skill.skillName) {
          existingSkillsMap.set(skill.skillName.toLowerCase(), skill);
        }
      });
    }

    const formattedMilestones = (milestones || []).map((m) => ({
      title: m.title || m.name || 'Untitled Milestone',
      description: m.description || '',
      status: (m.status || 'pending').toLowerCase(),
      targetDate: m.targetDate || null,
    }));

    const formattedSkillGap = (skillGap || []).map((s, index) => {
      const resolvedName = s.skillName || s.name || `Skill ${index + 1}`;
      const existingSkill = existingSkillsMap.get(resolvedName.toLowerCase());

      const incomingCurrent = Number(s.currentScore ?? s.current ?? s.currentLevel ?? 0);
      const incomingTarget = Number(s.targetScore ?? s.target ?? s.requiredLevel ?? 0);

      // Fix: Agar incoming score 0 hai lekin database mein pehle se better score (jaise 20 ya 40) hai, toh use retain karein
      const finalCurrent = (incomingCurrent === 0 && existingSkill?.currentScore > 0) 
        ? existingSkill.currentScore 
        : incomingCurrent;

      const finalTarget = incomingTarget > 0 
        ? incomingTarget 
        : (existingSkill?.targetScore || 100);

      const baselineVal = existingSkill?.baselineScore !== undefined 
        ? Number(existingSkill.baselineScore) 
        : finalCurrent;

      return {
        skillName: resolvedName,
        currentScore: finalCurrent,
        targetScore: finalTarget,
        baselineScore: baselineVal,
      };
    });

    const roadmap = await RoadmapModel.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        targetRole,
        atsScore: atsScore || 0,
        milestones: formattedMilestones,
        skillGap: formattedSkillGap,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Roadmap saved successfully.',
      data: { roadmap },
    });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error saving roadmap.',
    });
  }
};

// @desc    Update milestone status and adjust skill score dynamically
// @route   PATCH /api/roadmap/milestones/:milestoneId
// @access  Private
export const updateMilestoneStatus = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;
    const userId = req.user?._id || req.user?.id; 

    const roadmap = await RoadmapModel.findOne({ user: userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    const milestone = roadmap.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    const oldStatus = (milestone.status || 'pending').toLowerCase();
    const newStatus = status.toLowerCase();

    milestone.status = newStatus;
    const milestoneTitle = (milestone.title || "").toLowerCase();

    if (roadmap.skillGap && roadmap.skillGap.length > 0) {
      roadmap.skillGap.forEach((skill) => {
        const skillName = (skill.skillName || "").toLowerCase();
        
        const skillKeywords = skillName.split(/[\s\-()\/]+/g).filter(w => w.length > 2);
        const isMatched = milestoneTitle.includes(skillName) || 
                          skillName.includes(milestoneTitle) ||
                          skillKeywords.some(keyword => milestoneTitle.includes(keyword));

        if (isMatched) {
          const target = Number(skill.targetScore);
          const targetVal = isNaN(target) ? 100 : target;
          
          const baseline = Number(skill.baselineScore ?? 0);
          const baselineVal = isNaN(baseline) ? 0 : baseline;

          if (newStatus === 'completed' && oldStatus !== 'completed') {
            skill.currentScore = targetVal; 
          } else if (newStatus === 'pending' && oldStatus === 'completed') {
            skill.currentScore = baselineVal; 
          }
        }
      });
    }

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Milestone and skill progress updated successfully.",
      data: { roadmap }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};