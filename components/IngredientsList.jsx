import { Oval } from "react-loader-spinner"

export default function IngredientsList(props) {
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))
    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {props.ingredients.length > 3 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.getRecipe} disabled={props.loading}>
                    {props.loading ? (
                        <>
                            <Oval
                                height={16}
                                width={16}
                                color="#FAFAF8"
                                secondaryColor="#F0EFEB"
                                strokeWidth={4}
                                ariaLabel="Generating recipe"
                            />
                            Chef Gemini is cooking...
                        </>
                    ) : "Get a Chef Gemini recipe"}
                </button>
            </div>}
        </section>
    )
}