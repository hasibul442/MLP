const { default: mongoose } = require("mongoose");

const promptSchema = new mongoose.Schema({
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

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
