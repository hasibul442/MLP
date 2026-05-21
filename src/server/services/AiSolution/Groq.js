import OpenAI from "openai";

/**
 * Call Groq AI to generate math solution
 * @param {string} prompt - The formatted prompt
 * @returns {Promise<Object>} - Structured solution data
 */
export async function callGroq(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }

  const client = new OpenAI({
    baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1/responses",
    apiKey: process.env.GROQ_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    input: prompt,
  });

  // Extract text from Groq response structure
  let rawText = null;

  // Try output_text first (top-level field)
  if (response.output_text) {
    rawText = response.output_text;
  }
  // Try output array (message content)
  else if (response.output && Array.isArray(response.output)) {
    const messageOutput = response.output.find(item => item.type === "message");
    if (messageOutput?.content && Array.isArray(messageOutput.content)) {
      const outputText = messageOutput.content.find(c => c.type === "output_text");
      rawText = outputText?.text;
    }
  }

  if (!rawText) {
    throw new Error("Groq returned an empty response");
  }

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

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");

    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(text.slice(first, last + 1));
    }

    throw new Error("Invalid JSON response from Groq");
  }
}
