import mongoose from "mongoose";

const InputSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true
    },

    label: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },

    type: {
      type: String,
      enum: ["number", "text", "array"],
      required: true
    },

    // for array type
    itemType: {
      type: String,
      enum: ["number", "text"],
      default: null
    },

    minItems: {
      type: Number,
      default: null
    },

    maxItems: {
      type: Number,
      default: null
    },

    // validation
    min: Number,
    max: Number,

    required: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema(
  {
    problemType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProblemType",
      required: true
    },

    slug: {
      type: String,
      unique: true
    },

    template: {
      en: { type: String, required: true },
      bn: { type: String, required: true }
    },

    description: {
      en: String,
      bn: String
    },

    inputs: [InputSchema],

    // optional example values for preview/demo
    sampleInputs: {
      type: mongoose.Schema.Types.Mixed
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

export default mongoose.models.Problem ||
  mongoose.model("Problem", ProblemSchema);