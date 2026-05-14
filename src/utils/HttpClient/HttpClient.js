export async function GET({url, lang = "en", body = null, headers = { "Content-Type": "application/json" }}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        ...headers,
        "x-accept-language": lang,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
}