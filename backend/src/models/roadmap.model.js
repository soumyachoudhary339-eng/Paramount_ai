import mongoose from 'mongoose';

// Subdocument schema for individual milestone items
const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'Pending', 'In-Progress', 'Completed'],
    default: 'pending',
  },
  targetDate: String,
});

// Subdocument schema for skill gap data used by SkillGapChart
const skillGapSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    currentScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    targetScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    baselineScore: { // <-- Yeh naya field add karein (Resume analyzer wala original score store karne ke liye)
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
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
      unique: true, // Guarantees 1 roadmap per user account
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    milestones: [milestoneSchema],
    skillGap: [skillGapSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export default RoadmapModel;