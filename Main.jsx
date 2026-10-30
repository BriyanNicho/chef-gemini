import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromCopilot } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const recipeRef = React.useRef(null)

    React.useEffect(() => {
        if (recipe) {
            recipeRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }, [recipe])

    async function getRecipe() {
        setError("")
        setLoading(true)

        try {
            const recipeMarkdown = await getRecipeFromCopilot(ingredients)
            setRecipe(recipeMarkdown)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to generate a recipe.")
        } finally {
            setLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")?.toString().trim()

        if (!newIngredient) {
            return
        }

        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    loading={loading}
                />
            }

            {error && <p role="alert">{error}</p>}
            {recipe && (
                <div ref={recipeRef}>
                    <ClaudeRecipe recipe={recipe} />
                </div>
            )}
        </main>
    )
}