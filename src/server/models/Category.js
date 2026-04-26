import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
        icon: {
            type: String,
            default: "",
        },
        order: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Category =
    mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
