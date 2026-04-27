import { NextResponse } from "next/server";
import ProblemType from "@/server/models/ProblemType";
import { genarateSlug } from "@/utils/helper/helper";
import { formateProblemType } from "../services/ProblemTypeService";

export async function getProblemTypes(req) {
    try {
        const language = req.headers.get("x-accept-language") || null;
        const problemTypes = await ProblemType.find().sort({ difficulty: 1 });
        if (language) {
            const formattedProblemTypes = await formateProblemType(problemTypes, language);
            return NextResponse.json(formattedProblemTypes, { status: 200 });
        } else {
            return NextResponse.json(problemTypes, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching problem types:", error);
        return NextResponse.json({ error: "Failed to fetch problem types" }, { status: 500 });
    }
}

export async function createProblemType(req) {
    try {
        const payload = await req.json();
        const dataFormat = {
            title: {
                en: payload.title_en,
                bn: payload.title_bn,
            },
            description: {
                en: payload.description_en,
                bn: payload.description_bn,
            },
            slug: await genarateSlug(payload.title_en),
            categoryId: payload.categoryId,
            solverKey: payload.solverKey,
            explanationKey: payload.explanationKey,
            storyKey: payload.storyKey,
            visualKey: payload.visualKey,
            difficulty: payload.difficulty,
            classRange: payload.classRange,
        };

        const newProblemType = new ProblemType(dataFormat);
        await newProblemType.save();
        return NextResponse.json(newProblemType, { status: 201 });
    } catch (error) {
        console.error("Error creating problem type:", error);
        return NextResponse.json({ error: "Failed to create problem type" }, { status: 500 });
    }
}
