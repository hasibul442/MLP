import { callGemini } from "./AiSolution/GeminiAI.js";
import { callGroq } from "./AiSolution/Groq.js";
import Solution from "../models/Solution.js";

/**
 * Get math solution using AI (tries multiple providers with fallback)
 * @param {Object} problem - Problem object with metadata
 * @param {Object} payload - Input payload with user values
 * @returns {Promise<Object>} - Solution response
 */
export async function getMathSolutionByAI(problem, payload) {
  try {
    const prompt = buildPrompt(problem, payload);

    // Try Gemini first
    let aiData = null;
    let provider = null;
    let errors = [];

    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        aiData = await callGemini(prompt);
        provider = "gemini";
        console.log("Gemini AI success");
      } catch (geminiError) {
        console.error("Gemini failed:", geminiError.message);
        errors.push({ provider: "gemini", error: geminiError.message });
      }
    }

    // Fallback to Groq if Gemini failed
    if (!aiData && process.env.GROQ_API_KEY) {
      try {
        aiData = await callGroq(prompt);
        provider = "groq";
        console.log("Groq AI success");
      } catch (groqError) {
        console.error("Groq failed:", groqError.message);
        errors.push({ provider: "groq", error: groqError.message });
      }
    }

    console.log("AI solution attempt results:", errors);
    // If all providers failed
    if (!aiData) {
      throw new Error("All AI providers failed");
    }

    // Save/Update solution in database
    try {
      await saveSolutionToDatabase(problem, aiData, provider);
    } catch (dbError) {
      console.error("Failed to save solution to database:", dbError.message);
      // Don't fail the request if database save fails, just log it
    }

    return {
      success: true,
      problem: {
        id: problem?._id || problem?.id,
        type: problem?.problemType?.title || "",
        template: problem?.template || "",
        title: problem?.template || "",
        specialInstruction: problem?.specialInstruction || "",
        description: problem?.description || "",
      },
      inputs: payload,
      solution: {
        answer: aiData.answer,
        summary: aiData.summary,
        workingFormula: aiData.workingFormula,
        shortcutFormula: aiData.shortcutFormula,
        steps: aiData.steps,
        html: aiData.html,
      },
      metadata: {
        solverId: `ai-${provider}`,
        provider: provider,
        timestamp: new Date().toISOString(),
        fallbackAttempts: errors.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to generate AI solution",
        code: "AI_SOLUTION_ERROR",
      },
    };
  }
}

/**
 * Build prompt for AI (shared across all providers)
 * @param {Object} problem - Problem object
 * @param {Object} payload - User input values
 * @returns {string} - Formatted prompt
 */
function buildPrompt(problem, payload) {
  const templateEn = problem?.template?.en || "";
  const templateBn = problem?.template?.bn || "";
  const descriptionEn = problem?.description?.en || "";
  const descriptionBn = problem?.description?.bn || "";
  const typeTitleEn = problem?.problemType?.title?.en || "";
  const typeTitleBn = problem?.problemType?.title?.bn || "";

  return `You are an expert math tutor fluent in both English and Bangla (Bengali).
Solve the math problem using the provided input values.
Generate complete solutions in BOTH languages.

Problem Type (English): ${typeTitleEn}
Problem Type (Bangla): ${typeTitleBn}
Problem Template (English): ${templateEn}
Problem Template (Bangla): ${templateBn}
Problem Description (English): ${descriptionEn}
Problem Description (Bangla): ${descriptionBn}
Input Payload (JSON): ${JSON.stringify(payload)}

Return ONLY valid JSON with this exact shape:
{
  "answer": "final short answer (language neutral or both)",
  "summary": {
    "en": "short explanation in English",
    "bn": "সংক্ষিপ্ত ব্যাখ্যা বাংলায়"
  },
  "workingFormula": "main formula(s) used (can be universal math notation)",
  "shortcutFormula": {
    "en": "quick formula or method in English",
    "bn": "দ্রুত সূত্র বা পদ্ধতি বাংলায়"
  },
  "steps": [
    {
      "order": 1,
      "description": {
        "en": "Step description in English",
        "bn": "ধাপের বর্ণনা বাংলায়"
      },
      "formula": {
        "en": "Formula or calculation in English",
        "bn": "সূত্র বা গণনা বাংলায়"
      }
    }
  ],
  "html": {
    "en": "clean HTML for step-by-step explanation in English",
    "bn": "পর্যায়ক্রমে ব্যাখ্যার জন্য পরিষ্কার HTML বাংলায়"
  }
}

Rules:
- Do all calculations carefully.
- Keep units and symbols correct.
- Provide complete solutions in BOTH English (en) and Bangla (bn).
- steps array must have at least 2-5 steps showing the solution process.
- Each step should have order (number), description (en/bn), and formula (en/bn).
- shortcutFormula should be a simple, memorable formula or method students can use.
- html must be plain safe markup (div, p, ul, li, strong, em, br, table, tr, td).
- Do not include markdown fences.
- Do not include extra keys.
- Ensure Bangla text is grammatically correct and natural.`;
}

/**
 * Save or update AI solution in database
 * @param {Object} problem - Problem object
 * @param {Object} aiData - AI-generated solution data
 * @param {string} provider - AI provider name (gemini, groq, etc.)
 */
async function saveSolutionToDatabase(problem, aiData, provider) {
  const problemId = problem._id || problem.id;
  const problemTypeId = problem.problemType?._id || problem.problemType;

  // Check if solution already exists
  const existingSolution = await Solution.findOne({ problemId: problemId });

  if (existingSolution) {
    console.log(`Solution already exists for problem ${problemId}, skipping save`);
    return existingSolution;
  }

  // Extract template variables from steps
  const templateVariables = extractTemplateVariables(aiData);

  // Prepare solution data
  const solutionData = {
    problemId: problemId,
    problemTypeId: problemTypeId,

    // Steps with bilingual content
    steps: aiData.steps || [],

    // Templates
    workingFormulaTemplate: aiData.workingFormula || "",
    shortcutFormulaTemplate: {
      en: aiData.shortcutFormula?.en || "",
      bn: aiData.shortcutFormula?.bn || "",
    },
    htmlTemplate: {
      en: aiData.html?.en || "",
      bn: aiData.html?.bn || "",
    },
    summaryTemplate: {
      en: aiData.summary?.en || "",
      bn: aiData.summary?.bn || "",
    },
    answerTemplate: {
      en: aiData.answer || "",
      bn: aiData.answer || "",
    },

    // Metadata
    templateVariables: templateVariables,
    solverType: "ai-generated",
    verified: false,
    usageCount: 1,
    lastUsedAt: new Date(),

    // Provider info in notes
    notes: `Generated by ${provider} AI`,
  };

  // Create new solution
  const result = await Solution.create(solutionData);

  console.log(`New solution created for problem ${problemId}`);
  return result;
}

/**
 * Extract template variables from AI data
 * @param {Object} aiData - AI solution data
 * @returns {Array<string>} - Array of variable names
 */
function extractTemplateVariables(aiData) {
  const variables = new Set();

  // Extract from formulas in steps
  if (aiData.steps && Array.isArray(aiData.steps)) {
    aiData.steps.forEach(step => {
      const formulaEn = step.formula?.en || "";
      const formulaBn = step.formula?.bn || "";
      const combined = formulaEn + " " + formulaBn;

      // Find patterns like {variable} or variable names
      const matches = combined.match(/\b[a-z]+\b/gi) || [];
      matches.forEach(match => variables.add(match));
    });
  }

  return Array.from(variables);
}
