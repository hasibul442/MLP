import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

/**
 * Call Gemini AI to generate math solution
 * @param {string} prompt - The formatted prompt
 * @returns {Promise<Object>} - Structured solution data
 */
export async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
  }

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

//   console.log(JSON.stringify(response, null, 2));

  const rawText = getResponseText(response);
  const parsed = parseJsonSafely(rawText);

  return {
    answer: parsed?.answer ?? "",
    summary: {
      en: parsed?.summary?.en ?? "",
      bn: parsed?.summary?.bn ?? "",
    },
    workingFormula: parsed?.workingFormula ?? "",
    shortcutFormula: {
      en: parsed?.shortcutFormula?.en ?? "",
      bn: parsed?.shortcutFormula?.bn ?? "",
    },
    steps: Array.isArray(parsed?.steps)
      ? parsed.steps.map((step) => ({
          order: step?.order ?? 0,
          description: {
            en: step?.description?.en ?? "",
            bn: step?.description?.bn ?? "",
          },
          formula: {
            en: step?.formula?.en ?? "",
            bn: step?.formula?.bn ?? "",
          },
        }))
      : [],
    html: {
      en: parsed?.html?.en ?? "",
      bn: parsed?.html?.bn ?? "",
    },
  };
}

function getResponseText(response) {
  if (response?.text) {
    return response.text;
  }

  const parts = response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts.map((part) => part?.text || "").join("\n").trim();
  }

  throw new Error("Gemini returned an empty response");
}

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");

    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(text.slice(first, last + 1));
    }

    throw new Error("Invalid JSON response from Gemini");
  }
}
