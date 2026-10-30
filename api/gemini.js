const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

export default async function handler(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST")
        return response.status(405).json({ error: "Method not allowed" })
    }

    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash"

    if (!apiKey) {
        return response.status(500).json({ error: "GEMINI_API_KEY is not configured" })
    }

    const { contents, generationConfig } = request.body || {}

    if (!Array.isArray(contents) || contents.length === 0) {
        return response.status(400).json({ error: "A non-empty contents array is required" })
    }

    try {
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents,
                    generationConfig,
                }),
            }
        )

        const responseBody = await geminiResponse.text()
        response.status(geminiResponse.status)
        response.setHeader(
            "Content-Type",
            geminiResponse.headers.get("content-type") || "application/json"
        )
        return response.send(responseBody)
    } catch (error) {
        console.error("Gemini request failed:", error)
        return response.status(502).json({ error: "Unable to reach Gemini" })
    }
}
