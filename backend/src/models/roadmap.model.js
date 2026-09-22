import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    lowercase: true,
    trim: true,
  },
  targetDate: String,
  subTopics: { type: [String], default: [] },
  skills: { type: [String], default: [] },
});

// Individual skill gap schema
const roadmapSkillGapSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true, trim: true },
    currentScore: { type: Number, min: 0, max: 100, default: 0 },
    targetScore: { type: Number, min: 0, max: 100, default: 100 },
    baselineScore: { type: Number, min: 0, max: 100, default: 0 },
    suggestion: { type: String, default: '' }, // <--- Is line ko add karein agar per-skill suggestion chahiye
  },
  { _id: false }
);

// Main Roadmap Schema
const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
    },
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    milestones: [milestoneSchema],
    skillGap: [roadmapSkillGapSchema],
    suggestions: {
      type: [String],
      default: [], // Main roadmap level overall suggestions array
    },
  },
  { timestamps: true }
);

const RoadmapModel =
  mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export default RoadmapModel;