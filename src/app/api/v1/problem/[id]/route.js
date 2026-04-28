import { NextResponse } from "next/server";
import Problem from "@/server/models/Problem";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const problem = await Problem.findById(id).populate("problemType");
        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }
        return NextResponse.json(problem, { status: 200 });
    } catch (error) {
        console.error("Error fetching problem by ID:", error);
        return NextResponse.json({ error: "Failed to fetch problem" }, { status: 500 });
    }
}