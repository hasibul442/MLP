import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      unique: true // One solution template per problem
    },

    problemTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemType",
      required: true
    },

    solutionEn: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    solutionBn: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Metadata
    solverType: {
      type: String,
      enum: ["algorithmic", "ai-generated", "manual"],
      default: "manual"
    },

    verified: {
      type: Boolean,
      default: false
    },

    verifiedBy: {
      type: String,
      default: ""
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    // Usage tracking
    usageCount: {
      type: Number,
      default: 0
    },

    lastUsedAt: {
      type: Date,
      default: null
    },

    // Notes for admins
    notes: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
SolutionSchema.index({ problemId: 1 });
SolutionSchema.index({ problemTypeId: 1 });
SolutionSchema.index({ verified: 1, isActive: 1 });

export default mongoose.models.Solution ||
  mongoose.model("Solution", SolutionSchema);
