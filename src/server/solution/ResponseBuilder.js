import { interpolateTemplate } from "@/utils/helper/admin/helper";

export function buildResponse(
  problem,
  inputsData,
  finalAnswer,
  workingFormula,
  htmlOutput,
  solverId
) {
  return {
    success: true,
    problem: {
      id: problem._id,
      type: problem.problemType?.title,
      template: problem.template,
      title: {
        en: interpolateTemplate(problem.template?.en, inputsData),
        bn: interpolateTemplate(problem.template?.bn, inputsData),
      },
      specialInstruction: problem.specialInstruction,
      description: problem.description,
    },
    inputs: inputsData,
    solution: {
      answer: finalAnswer,
      summary: {
        en: `The answer is ${finalAnswer}`,
        bn: `উত্তর হলো ${finalAnswer}`,
      },
      workingFormula: workingFormula,
      html: htmlOutput,
    },
    metadata: {
      solverId: solverId,
      timestamp: new Date().toISOString(),
    },
  };
}
