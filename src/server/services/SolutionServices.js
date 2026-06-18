import { solveRatioProportion } from "../solution/ratio/solveRatioProportion";
import { getMathSolutionByAI } from "./AISolutionServices";
import Solution from "../models/Solution.js";
import { interpolateTemplate } from "@/utils/helper/admin/helper";

export async function getMathSolution(lang, question, type, payload) {
  let solution = null;
  // First try to check from database if there is already a verified solution for the problem and input combination and then show the response from db.
  const query = {
    problemId: question?._id || question?.id,
  };
  const getSolutionFromDb = await Solution.findOne(query).populate("problemId").populate("problemTypeId").sort({ updatedAt: -1 });

  if (getSolutionFromDb) {
    // Transform the data to rename problemId to problem and problemTypeId to problemType
    const solutionObj = getSolutionFromDb.toObject();
    solution = {
      ...solutionObj,
      problem: solutionObj.problemId,
      problemType: solutionObj.problemTypeId,
      problemId: undefined,
      problemTypeId: undefined
    };
  } else {
    // If there is no verified solution in database then call AI to get the solution and show to user.
    solution = await getMathSolutionByAI(question, payload);
  }

    if (solution && lang != null) {
      solution = localizeSolutionResponse(solution, lang);
    } else {
    solution = {
      success: false,
      error: {
        message: "No solver found for the given problem type",
        code: "NO_SOLVER_FOUND",
      },
    };
  }
  return solution;
}

function localizeSolutionResponse(solution, lang) {
  //Lang Capitalization
  let langCapitalized = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();

  const loc_problem = localizeProblem(solution?.problem, lang);
  const loc_input = localizeInput(solution?.problem?.inputs, lang);
  const loc_problemtype = localizeProblemType(solution?.problemType, lang);

  let sol = {
     problem: loc_problem,
     inputs: loc_input,
     problemType: loc_problemtype,
      sampleInputs : solution?.problem?.sampleInputs || null,
      solution : solution?.[`solution${langCapitalized}`] || null
  }

  return sol;
}
function localizeProblem(problemData, lang) {
  const problem = {
    id: problemData?._id,
    template: problemData?.template?.[lang],
    title: interpolateTemplate(problemData?.template?.[lang], problemData?.sampleInputs),
    specialInstruction: problemData?.specialInstruction,
    description: problemData?.description?.[lang],
    sampleInputs: problemData?.sampleInputs,
  };
  return problem;
}

function localizeProblemType(problemTypeData, lang) {
  const problemType = {
    id: problemTypeData?._id,
    title: problemTypeData?.title?.[lang],
    description: problemTypeData?.description?.[lang],
    slug: problemTypeData?.slug,
    categoryId: problemTypeData?.categoryId,
    solverKey: problemTypeData?.solverKey,
    explanationKey: problemTypeData?.explanationKey,
    storyKey: problemTypeData?.storyKey,
    visualKey: problemTypeData?.visualKey,
    difficulty : problemTypeData?.difficulty,
  };
  return problemType;
}


function localizeInput(inputData, lang) {
  if (!inputData || !Array.isArray(inputData)) return null;

  return inputData.map((inputItem) => {
    return {
      ...inputItem,
      label: inputItem.label?.[lang]
    };
  });
}

function localizeSteps(stepsData, lang) {
  if (!stepsData || !Array.isArray(stepsData)) return null;

  return stepsData.map((step) => {
    const localizedStep = {
      ...step,
      description: step.description?.[lang],
      formula: step.formula?.[lang],
    };
    return localizedStep;
  });
}
