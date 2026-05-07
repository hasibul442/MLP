//Make Problem Get and Create API
import { NextResponse } from "next/server";
import Problem from "@/server/models/Problem";
import ProblemType from "@/server/models/ProblemType";
import { genarateSlug } from "@/utils/helper/helper";
import { formateProblemList, getSingleProblemDetails } from "../services/ProblemServices";

export async function getProblems(req) {
  try {
    const language = req.headers.get("x-accept-language") || null;
    const problems = await Problem.find()
      .populate("problemType")
      .sort({ createdAt: -1 });
    if (language) {
      const formattedProblems = await formateProblemList(problems, language);
      return NextResponse.json(formattedProblems, { status: 200 });
    } else {
      return NextResponse.json(problems, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 },
    );
  }
}

export async function createProblem(req) {
  try {
    const payload = await req.json();
    const problemTypeId = payload.problem_type_id;
    const slugSource = payload.template_en || "problem";
    const slug = await genarateSlug(slugSource);
    const problemType = await ProblemType.findById(problemTypeId);
    if (!problemType) {
      return NextResponse.json(
        { error: "Invalid problem type ID" },
        { status: 400 },
      );
    }

    const newProblem = new Problem({
      problemType: problemTypeId,
      template: {
        en: payload.template_en || "",
        bn: payload.template_bn || "",
      },
      description: {
        en: payload.description_en || "",
        bn: payload.description_bn || "",
      },
      slug,
      inputs: formatInputs(payload.inputs || []),
      sampleInputs: payload.sample_inputs,
      isActive: payload.isActive ?? true,
      specialInstruction: payload.special_instruction || null,
    });
    await newProblem.save();
    return NextResponse.json(newProblem, { status: 200 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 },
    );
  }
}

function formatInputs(inputs) {
  return inputs.map((input) => ({
    key: input.key.trim(),
    label: {
      en: input.label_en || "",
      bn: input.label_bn || "",
    },
    type: input.type,
    required: input.required ?? true,
    minItems:
      input.min_items !== undefined ? Number(input.min_items) : undefined,
    maxItems:
      input.max_items !== undefined ? Number(input.max_items) : undefined,
    min: input.min !== undefined ? Number(input.min) : undefined,
    max: input.max !== undefined ? Number(input.max) : undefined,
    itemType:
      input.item_type || (input.type === "array" ? "number" : undefined),
  }));
}

export async function getProblemById(req, params) {
  try {
    const language = req.headers.get("x-accept-language") || null;
    const { id } = await params;
    const problem = await Problem.findById(id).populate("problemType");
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (language) {
      const formattedProblem = await getSingleProblemDetails(problem, language);
      return NextResponse.json(formattedProblem, { status: 200 });
    } else {
      return NextResponse.json(problem, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching problem by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 },
    );
  }
}
