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
      const s = await saveSolutionToDatabase(problem, aiData, provider);
      await savePromptToDatabase(problem, s, prompt);
    } catch (dbError) {
      console.error("Failed to save solution to database:", dbError.message);
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
        detailedSolution: aiData.detailedSolution,
        shortcutSolution: aiData.shortcutSolution,
        memoryMethod: aiData.memoryMethod,
        conceptualUnderstanding: aiData.conceptualUnderstanding,
        visualThinkingMethod: aiData.visualThinkingMethod,
        alternativeMethod: aiData.alternativeMethod,
        examStrategyMethod: aiData.examStrategyMethod,
        mentalMathMethod: aiData.mentalMathMethod,
        patternRecognitionMethod: aiData.patternRecognitionMethod,
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

  return `You are an expert mathematics tutor fluent in both English and Bangla (বাংলা) Your role is not only to solve math problems but also to teach students with different learning styles, The student may be a complete beginner. Therefore, prioritize understanding over brevity. 
Solve the math problem and return ONLY valid JSON - no markdown, no code fences, no extra text.

Problem Type (English): ${typeTitleEn}
Problem Type (Bangla): ${typeTitleBn}
Problem Template (English): ${templateEn}
Problem Template (Bangla): ${templateBn}
Problem Description (English): ${descriptionEn}
Problem Description (Bangla): ${descriptionBn}
Input Payload (JSON): ${JSON.stringify(payload)}

CRITICAL JSON REQUIREMENTS (MUST FOLLOW):
1. Return ONLY raw JSON - no markdown code fences (\`\`\`json), no extra text before or after
2. All string values MUST have properly escaped quotes: use \\" for quotes inside strings
3. All backslashes MUST be escaped: use \\\\ 
4. No trailing commas after last object property or array element
5. All braces { } and brackets [ ] must be properly matched and closed
6. Bangla (Unicode) text is allowed but must be inside properly quoted strings
7. Numbers should NOT be quoted unless they are part of a formula string
8. Use double quotes " for all JSON keys and string values, never single quotes
9. Test that your JSON is valid before returning it

TEACHING APPROACH:
- Assume student is a complete beginner
- Explain every step clearly in both English and Bangla
- Show all intermediate calculations
- Prioritize understanding over brevity
- Explain WHY each step is performed

GENERATE ALL 9 TEACHING METHODS:

1. detailedSolution: Step-by-step for beginners (steps array with order, description, formula)
2. shortcutSolution: Fast method for exams/MCQs
3. memoryMethod: Easy recall trick or mnemonic
4. conceptualUnderstanding: Why the method works (intuition)
5. visualThinkingMethod: Text-based visualization (number lines, grids, diagrams)
6. alternativeMethod: Different valid approach (or explain why primary is optimal)
7. examStrategyMethod: Time-saving tips, common traps, elimination techniques
8. mentalMathMethod: Minimal writing, arithmetic shortcuts
9. patternRecognitionMethod: Recurring patterns for similar problems

REQUIRED JSON OUTPUT STRUCTURE:

{
  "answer": "final answer as string",
  "summary": {
    "en": "English summary",
    "bn": "বাংলা সারাংশ"
  },
  "workingFormula": "main formula(s) used",
  "detailedSolution": {
    "steps": [
      {
        "order": 1,
        "description": {
          "en": "step explanation in English",
          "bn": "ধাপের ব্যাখ্যা বাংলায়"
        },
        "formula": {
          "en": "calculation in English",
          "bn": "গণনা বাংলায়"
        }
      }
    ]
  },
  "shortcutSolution": {
    "en": "fast method in English",
    "bn": "দ্রুত পদ্ধতি বাংলায়"
  },
  "memoryMethod": {
    "en": "recall trick in English",
    "bn": "মনে রাখার কৌশল বাংলায়"
  },
  "conceptualUnderstanding": {
    "en": "why it works in English",
    "bn": "কেন কাজ করে বাংলায়"
  },
  "visualThinkingMethod": {
    "en": "visual explanation in English",
    "bn": "দৃশ্য ব্যাখ্যা বাংলায়"
  },
  "alternativeMethod": {
    "en": "alternative in English",
    "bn": "বিকল্প বাংলায়"
  },
  "examStrategyMethod": {
    "en": "exam strategy in English",
    "bn": "পরীক্ষার কৌশল বাংলায়"
  },
  "mentalMathMethod": {
    "en": "mental math in English",
    "bn": "মানসিক গণনা বাংলায়"
  },
  "patternRecognitionMethod": {
    "en": "pattern in English",
    "bn": "প্যাটার্ন বাংলায়"
  },
  "html": {
    "en": "HTML content in English (use only: div, p, ul, li, strong, em, br, table, tr, td)",
    "bn": "HTML বিষয়বস্তু বাংলায় (শুধুমাত্র ব্যবহার করুন: div, p, ul, li, strong, em, br, table, tr, td)"
  }
}

JSON FORMATTING RULES:
- Escape quotes in strings: "He said \\"hello\\""
- Escape backslashes: "Use \\\\ for backslash"  
- No trailing commas: {"a": 1, "b": 2} NOT {"a": 1, "b": 2,}
- Close all brackets and braces properly
- Use double quotes only, never single quotes
- For multi-line text in strings, use \\n not actual line breaks
- Ensure all Unicode (Bangla) characters are inside quoted strings

IMPORTANT: Your response must be ONLY the JSON object above. No markdown, no explanations, just raw valid JSON that can be parsed with JSON.parse().
`;
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

  // Extract and separate bilingual steps
  const bilingualSteps = aiData?.steps || [];
  const stepsEn = bilingualSteps.map(step => ({
    order: step.order,
    description: step.description?.en || "",
    formula: step.formula?.en || ""
  }));

  const stepsBn = bilingualSteps.map(step => ({
    order: step.order,
    description: step.description?.bn || "",
    formula: step.formula?.bn || ""
  }));

  // Prepare solution data
  const solutionData = {
    problemId: problemId,
    problemTypeId: problemTypeId,

    solutionEn: {
      answer: aiData.answer,
      summary: aiData.summary?.en || "",
      workingFormula: aiData.workingFormula || "",
      shortcutFormula: aiData.shortcutFormula?.en || "",
      steps: stepsEn,
      html: aiData.html?.en || "",
      memoryMethod: aiData.memoryMethod?.en || "",
      conceptualUnderstanding: aiData.conceptualUnderstanding?.en || "",
      visualThinkingMethod: aiData.visualThinkingMethod?.en || "",
      alternativeMethod: aiData.alternativeMethod?.en || "",
      examStrategyMethod: aiData.examStrategyMethod?.en || "",
      mentalMathMethod: aiData.mentalMathMethod?.en || "",
      patternRecognitionMethod: aiData.patternRecognitionMethod?.en || "",
    },
    solutionBn: {
      answer: aiData.answer,
      summary: aiData.summary?.bn || "",
      workingFormula: aiData.workingFormula || "",
      shortcutFormula: aiData.shortcutFormula?.bn || "",
      steps: stepsBn,
      html: aiData.html?.bn || "",
      memoryMethod: aiData.memoryMethod?.bn || "",
      conceptualUnderstanding: aiData.conceptualUnderstanding?.bn || "",
      visualThinkingMethod: aiData.visualThinkingMethod?.bn || "",
      alternativeMethod: aiData.alternativeMethod?.bn || "",
      examStrategyMethod: aiData.examStrategyMethod?.bn || "",
      mentalMathMethod: aiData.mentalMathMethod?.bn || "",
      patternRecognitionMethod: aiData.patternRecognitionMethod?.bn || "",
    },
    
    solverType: "ai-generated",
    verified: false,
    usageCount: 1,
    lastUsedAt: new Date(),

    // Provider info in notes
    notes: `Generated by ${provider} AI`,
  };

  // Create new solution
  const result = await Solution.create(solutionData);

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


async function savePromptToDatabase(problem, s, prompt) {
  try {
    const Prompt = require("../models/Prompt.js");
    const promptData = {
      solutionId: s._id,
      problemId: problem._id || problem.id,
      prompt: prompt
    };
    await Prompt.create(promptData);
    console.log(`Prompt saved for problem ${problem._id || problem.id}`);
  } catch (error) {
    console.error("Failed to save prompt to database:", error.message);
  }
}