const { default: mongoose } = require("mongoose");

const PromptSchema = new mongoose.Schema({
    solutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Solution",
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
  prompt: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
