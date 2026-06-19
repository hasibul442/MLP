import { NextResponse } from "next/server";
import Prompt from "@/server/models/Prompt";
import "@/server/models/Problem";
import "@/server/models/Solution";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const genaratedPrompt = await Prompt.findOne({ problemId: id })
                                            // .populate("problemId")
                                            // .populate("solutionId")
                                            .exec();

        if (!genaratedPrompt) {
            return NextResponse.json({ status: "info", message: "Prompt not found for the given problem ID" }, { status: 404 });
        }

        return NextResponse.json({ status: "success", data: genaratedPrompt }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "An error occurred while fetching the prompt", details: error.message }, 
            { status: 500 });
    }
}