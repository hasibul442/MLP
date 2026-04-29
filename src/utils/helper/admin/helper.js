export function interpolateTemplate(template, inputs) {
  if (!template) return "-";
  let result = template;

  // Replace all {{key}} placeholders with values from inputs
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = inputs?.[key];
    if (value === undefined || value === null) {
      return match; // Keep the placeholder if value not found
    }
    // Format arrays without brackets - join with comma
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    // Format objects as JSON strings
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  });

  return result;
}

export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseNumber(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}
