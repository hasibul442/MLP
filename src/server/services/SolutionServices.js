import { solveRatioProportion } from "../solution/ratio/solveRatioProportion";

export async function getMathSolution(lang, problem, type, payload) {
  let solution = null;

  if (type.solverKey === "solveRatioProportion") {
    solution = solveRatioProportion(problem, type, payload);

    if (solution.success && lang != null) {
      solution = localizeSolutionResponse(solution, lang);
    }
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
  const loc_problem = localizeProblem(solution?.problem, lang);
  const loc_input = localizeInput(solution?.inputs, lang);
  const loc_sol = localizeSolution(solution?.solution, lang);
  solution.problem = loc_problem;
  solution.inputs = loc_input;
  solution.solution = loc_sol;
  return solution;
}
function localizeProblem(problemData, lang) {
    const problem = {
        id: problemData.id,
        template: problemData.template?.[lang],
        type: problemData.type,
        specialInstruction: problemData.specialInstruction,
        description: problemData.description?.[lang],
    }
    return problem;
}
function localizeInput(inputData, lang) {
    if (!inputData) return null;
    
    const input = {};
    
    // Copy all input values except labels
    Object.keys(inputData).forEach(key => {
        if (key === 'labels') {
            // Localize labels
            const localizedLabels = {};
            if (inputData.labels) {
                Object.keys(inputData.labels).forEach(labelKey => {
                    localizedLabels[labelKey] = inputData.labels[labelKey]?.[lang] || labelKey;
                });
            }
            input.labels = localizedLabels;
        } else {
            // Copy numeric/string values as-is
            input[key] = inputData[key];
        }
    });
    
    return input;
}

function localizeSolution(solutionData, lang) {
  const solution = {
    answer: solutionData.answer,
    summary: solutionData.summary?.[lang],
    workingFormula: solutionData.workingFormula,
    html: solutionData.html?.[lang],
  };
  return solution;
}
