import RoadmapModel from '../models/roadmap.model.js';

// Helper function to format standardized roadmap response
export const formatRoadmapResponse = (roadmap) => {
  if (!roadmap) {
    return {
      id: null,
      _id: null,
      targetRole: '',
      role: '',
      atsScore: 0,
      suggestions: [],
      milestones: [],
      skillGap: [],
    };
  }

  const doc = typeof roadmap.toObject === 'function' ? roadmap.toObject() : roadmap;

  return {
    id: doc._id || doc.id || null,
    _id: doc._id || doc.id || null,
    targetRole: doc.targetRole || '',
    role: doc.targetRole || '',
    atsScore: doc.atsScore || 0,
    // Safely map suggestions array
    suggestions: Array.isArray(doc.suggestions) ? doc.suggestions : [],
    milestones: (doc.milestones || []).map((m) => ({
      id: m._id || m.id,
      _id: m._id || m.id,
      title: m.title || '',
      description: m.description || '',
      status: m.status || 'pending',
      targetDate: m.targetDate || null,
      subTopics: Array.isArray(m.subTopics) ? m.subTopics : [],
      skills: Array.isArray(m.skills) ? m.skills : [],
    })),
    skillGap: (doc.skillGap || []).map((s) => ({
      skillName: s.skillName || '',
      name: s.skillName || '',
      currentScore: s.currentScore ?? 0,
      currentLevel: s.currentScore ?? 0,
      targetScore: s.targetScore ?? 100,
      requiredLevel: s.targetScore ?? 100,
      baselineScore: s.baselineScore ?? 0,
      suggestion: s.suggestion || '',
    })),
  };
};

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
          roadmap: formatRoadmapResponse(null),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Roadmap retrieved successfully.',
      data: {
        roadmap: formatRoadmapResponse(roadmap),
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

// @desc    Create or update roadmap (Preserves existing progress scores & missing skill names)
// @route   POST /api/roadmap
// @access  Private

export const createOrUpdateRoadmap = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication failed.',
      });
    }

    // Extract all possible top-level and nested containers
    const { 
      targetRole, 
      atsScore, 
      milestones, 
      skillGap, 
      suggestions, 
      missingSkills, 
      analysis, 
      data,
      roadmap: inputRoadmap 
    } = req.body;

    // 1. Resolve Target Role safely
    const activeTargetRole = 
      targetRole || 
      analysis?.targetRole || 
      data?.analysis?.targetRole || 
      inputRoadmap?.targetRole || 
      data?.roadmap?.targetRole;

    if (!activeTargetRole) {
      return res.status(400).json({
        success: false,
        message: 'Target role is required.',
      });
    }

    // 2. ROOT CAUSE FIX: Deep Search All Payload Layers for Suggestions
    let rawSuggestions = 
      suggestions || 
      analysis?.suggestions || 
      data?.analysis?.suggestions || 
      data?.roadmap?.suggestions || 
      inputRoadmap?.suggestions || 
      req.body.recommendations || 
      [];

    const formattedSuggestions = Array.isArray(rawSuggestions)
      ? rawSuggestions
          .map((item) => (typeof item === 'string' ? item : item?.text || item?.suggestion || ''))
          .filter((str) => Boolean(str && str.trim().length > 0))
      : [];

    // 3. Fetch existing database document for fallback values
    const existingRoadmap = await RoadmapModel.findOne({ user: userId });

    const existingSkillsMap = new Map();
    if (existingRoadmap && existingRoadmap.skillGap) {
      existingRoadmap.skillGap.forEach((skill) => {
        if (skill.skillName) {
          existingSkillsMap.set(skill.skillName.toLowerCase(), skill);
        }
      });
    }

    // 4. Format Milestones
    const rawMilestones = 
      milestones || 
      analysis?.roadmap || 
      data?.analysis?.roadmap || 
      inputRoadmap?.milestones || 
      data?.roadmap?.milestones || 
      [];

    const formattedMilestones = rawMilestones.map((m) => ({
      title: m.title || m.name || 'Untitled Milestone',
      description: m.description || '',
      status: (m.status || 'pending').toLowerCase(),
      targetDate: m.targetDate || null,
      subTopics: Array.isArray(m.subTopics) ? m.subTopics : [],
      skills: Array.isArray(m.skills) ? m.skills : [],
    }));

    // 5. Format Skill Gap
    const rawSkillGap = 
      skillGap || 
      analysis?.skillGap || 
      data?.analysis?.skillGap || 
      inputRoadmap?.skillGap || 
      data?.roadmap?.skillGap || 
      [];

    const formattedSkillGap = rawSkillGap.map((s, index) => {
      let rawName = typeof s === 'string' ? s : (s.skillName || s.name || s.skill);
      
      if (!rawName && Array.isArray(missingSkills) && missingSkills[index]) {
        rawName = missingSkills[index];
      }

      const resolvedName = rawName || `Skill ${index + 1}`;
      const existingSkill = existingSkillsMap.get(resolvedName.toLowerCase());

      const incomingCurrent = Number(
        typeof s === 'object' ? (s.currentScore ?? s.current ?? s.currentLevel ?? 0) : 0
      );
      const incomingTarget = Number(
        typeof s === 'object' ? (s.targetScore ?? s.target ?? s.requiredLevel ?? 100) : 100
      );

      const finalCurrent =
        incomingCurrent === 0 && existingSkill?.currentScore > 0
          ? existingSkill.currentScore
          : incomingCurrent;

      const finalTarget =
        incomingTarget > 0
          ? incomingTarget
          : existingSkill?.targetScore || 100;

      const baselineVal =
        existingSkill?.baselineScore !== undefined
          ? Number(existingSkill.baselineScore)
          : finalCurrent;

      return {
        skillName: resolvedName,
        currentScore: finalCurrent,
        targetScore: finalTarget,
        baselineScore: baselineVal,
        suggestion: typeof s === 'object' ? (s.suggestion || '') : '',
      };
    });

    // 6. Fallback to Database Suggestions if new array is empty
    const finalSuggestions = formattedSuggestions.length > 0 
      ? formattedSuggestions 
      : (existingRoadmap?.suggestions || []);

    // 7. Update or Create in MongoDB
    const roadmap = await RoadmapModel.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        targetRole: activeTargetRole,
        atsScore: atsScore || analysis?.atsScore || data?.analysis?.atsScore || 0,
        milestones: formattedMilestones,
        skillGap: formattedSkillGap,
        suggestions: finalSuggestions,
      },
      { new: true, upsert: true, runValidators: true }
    );

    // 8. Construct Clean Output Data
    const doc = roadmap.toObject();

    const formattedResponse = {
      id: doc._id,
      role: doc.targetRole,
      targetRole: doc.targetRole,
      atsScore: doc.atsScore || 0,
      suggestions: doc.suggestions || [],
      milestones: (doc.milestones || []).map((m) => ({
        id: m._id,
        _id: m._id,
        title: m.title,
        description: m.description,
        status: m.status,
        targetDate: m.targetDate,
      })),
      skillGap: (doc.skillGap || []).map((s) => ({
        skillName: s.skillName,
        currentScore: s.currentScore,
        targetScore: s.targetScore,
        baselineScore: s.baselineScore,
        name: s.skillName,
        currentLevel: s.currentScore,
        requiredLevel: s.targetScore,
      })),
    };

    return res.status(200).json({
      success: true,
      message: 'Roadmap saved successfully.',
      data: { roadmap: formattedResponse },
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
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const milestone = roadmap.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const oldStatus = (milestone.status || 'pending').toLowerCase();
    const newStatus = status.toLowerCase();

    milestone.status = newStatus;
    const milestoneTitle = (milestone.title || '').toLowerCase();

    if (roadmap.skillGap && roadmap.skillGap.length > 0) {
      roadmap.skillGap.forEach((skill) => {
        const skillName = (skill.skillName || '').toLowerCase();

        const skillKeywords = skillName
          .split(/[\s\-()\/]+/g)
          .filter((w) => w.length > 2);

        const isMatched =
          milestoneTitle.includes(skillName) ||
          skillName.includes(milestoneTitle) ||
          skillKeywords.some((keyword) => milestoneTitle.includes(keyword));

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
      message: 'Milestone and skill progress updated successfully.',
      data: { roadmap: formatRoadmapResponse(roadmap) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};