const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

const GEMINI_URL = "/api/gemini"
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.8-flash"

export async function getRecipeFromCopilot(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    let response

    try {
        response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                contents: [{
                    role: "user",
                    parts: [{
                        text: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
                    }],
                }],
                generationConfig: { maxOutputTokens: 1024 },
            }),
        })
    } catch {
        throw new Error(
            "Tidak dapat terhubung ke Gemini. Pastikan server Vite sudah direstart."
        )
    }

    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(
            `Gemini request failed (${response.status}): ${errorBody || response.statusText}`
        )
    }

    const responseBody = await response.text()
    let data

    try {
        data = JSON.parse(responseBody)
    } catch {
        throw new Error(
            `Gemini returned non-JSON data (${response.status}, ${response.headers.get("content-type") || "unknown content type"}): ${responseBody.slice(0, 200)}`
        )
    }

    const recipe = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (typeof recipe !== "string" || !recipe.trim()) {
        throw new Error("Gemini returned an invalid recipe response.")
    }

    return recipe
}
