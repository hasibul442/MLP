import mongoose from "mongoose";

const problemTypeSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
        },
        description: {
            en: { type: String, default: "" },
            bn: { type: String, default: "" },
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        solverKey: {
            type: String,
            default: "",
        },
        explanationKey: {
            type: String,
            default: "",
        },
        storyKey: {
            type: String,
            default: "",
        },
         visualKey: {
            type: String,
            default: "",
         },
         difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
         },
         classRange: {
            type: String,
            default: "",
         },
    },
    { timestamps: true }
);

const ProblemType =
    mongoose.models.ProblemType || mongoose.model("ProblemType", problemTypeSchema);

export default ProblemType;
        