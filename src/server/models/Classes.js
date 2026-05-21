import mongoose from "mongoose";

const classesSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        class_number: {type: Number, required: true },
        class_name: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
        },
         description: {
            en: { type: String, default: "" },
            bn: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

const Classes =
    mongoose.models.Classes || mongoose.model("Classes", classesSchema);

export default Classes;
