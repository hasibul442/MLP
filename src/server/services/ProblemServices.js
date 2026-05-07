import { interpolateTemplate } from "@/utils/helper/admin/helper";

export async function formateProblemList(problems, lang) {
  const formatedData = [];

  for (const problem of problems) {
    formatedData.push({
      id: problem._id,
      template: problem.template?.[lang],
      title: interpolateTemplate(problem.template?.[lang], problem.sampleInputs),
      description: problem.description?.[lang],
      slug: problem.slug,
      specialInstruction: problem.specialInstruction,
      inputs: formatInputs(problem.inputs, lang),
      sampleInputs: problem.sampleInputs,
      problemType: translateProblemType(problem.problemType, lang),
    });
  }
  return formatedData;
}

function formatInputs(inputs, lang) {
  const translateInputs = [];
  for (const input of inputs) {
    translateInputs.push({
      key: input.key,
      label: input.label?.[lang],
      type: input.type,
      required: input.required,
      minItems: input.minItems,
      maxItems: input.maxItems,
      min: input.min,
      max: input.max,
    });
  }
  return translateInputs;
}

function translateProblemType(problemType, lang) {
  return {
    id: problemType._id,
    title: problemType.title?.[lang],
    description: problemType.description?.[lang],
    slug: problemType.slug,
    categoryId: problemType.categoryId,
    solverKey: problemType.solverKey,
    explanationKey: problemType.explanationKey,
    storyKey: problemType.storyKey,
    visualKey: problemType.visualKey,
    difficulty: problemType.difficulty,
    classRange: problemType.classRange,
  };
}

export async function getSingleProblemDetails(problem, lang) {
    
    return {
        success: true,
        template: problem.template?.[lang],
        title: interpolateTemplate(problem.template?.[lang], problem.sampleInputs),
        description: problem.description?.[lang],
        id: problem._id,
        problemType: translateProblemType(problem.problemType, lang),
        slug: problem.slug,
        specialInstruction: problem.specialInstruction,
        inputs: formatInputs(problem.inputs, lang),
        sampleInputs: problem.sampleInputs,
    }

    // return problem
}