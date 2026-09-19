import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
    default: "",
  },
  details: {
    type: String,
    default: "",
  },
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    default: "",
  },
  institute: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    default: "",
  },
});

const skillGapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    default: 90,
  },
  current: {
    type: Number,
    default: 0,
  },
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    personalInfo: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: "",
      },
      targetRole: {
        type: String,
        required: true,
      },
      summary: {
        type: String,
        default: "",
      },
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: [experienceSchema],
    education: [educationSchema],
    analysisResult: {
      atsScore: {
        type: Number,
        default: 0,
      },
      extractedSkills: [
        {
          type: String,
        },
      ],
      missingSkills: [
        {
          type: String,
        },
      ],
      skillGap: [skillGapSchema],
      suggestions: [
        {
          type: String,
        },
      ],
      analyzedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

const resumeModel = mongoose.model("resumes", resumeSchema);

export default resumeModel;