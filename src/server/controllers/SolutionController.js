import { NextResponse } from "next/server";
import Problem from "../models/Problem";
import ProblemType from "../models/ProblemType";
import { getMathSolution } from "../services/SolutionServices";

export async function getSolution(req) {
    const language = req.headers.get("x-accept-language") || null;
    const payload = await req.json();
    const problems = await Problem.findById(payload.id).lean();

    if (!problems) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const type = await ProblemType.findById(problems.problemType).lean();

    if (!type) {
        return NextResponse.json({ error: "Category Invalid" }, { status: 404 });
    }

    return NextResponse.json(await getMathSolution(language, problems, type, payload), { status: 200 });
}