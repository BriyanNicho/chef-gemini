import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")

    return {
        plugins: [react()],
        server: {
            proxy: {
                "/api/gemini": {
                    target: "https://generativelanguage.googleapis.com",
                    changeOrigin: true,
                    rewrite: () => `/v1beta/models/${env.VITE_GEMINI_MODEL || "gemini-3.8-flash"}:generateContent`,
                    headers: {
                        "x-goog-api-key": env.GEMINI_API_KEY,
                        Accept: "application/json",
                    },
                },
            },
        },
    }
})