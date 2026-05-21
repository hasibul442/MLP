import mongoose from "mongoose";

const StepSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true
    },
    description: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },
    formula: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },
    // For template placeholders like {ratio1}, {ratio2}, {total}
    variables: [String]
  },
  { _id: false }
);

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

    // Solution method/approach
    method: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // Step-by-step solution template
    steps: [StepSchema],

    // Overall explanation template
    explanation: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // Working formula template with placeholders
    workingFormulaTemplate: {
      type: String,
      default: ""
    },

    // Shortcut formula or method template
    shortcutFormulaTemplate: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // HTML template for rendering solution
    htmlTemplate: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // Summary template
    summaryTemplate: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // Answer format template (e.g., "The two parts are {part1} and {part2}")
    answerTemplate: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" }
    },

    // List of all variables used in templates
    templateVariables: [String],

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
