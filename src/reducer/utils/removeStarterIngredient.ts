import { Ingredient } from "../state";

const removeStarterIngredient = (ingredients: Ingredient[], starterRecipeID: number): Ingredient[] => {
  const starterIndex = ingredients.findIndex(ingredient => ingredient.starterRecipeID === starterRecipeID);
  if (starterIndex) {
    const starterIngredient = ingredients[starterIndex];
    if (starterIngredient.recipeCount) {
      delete starterIngredient.starterRecipeID;
    }
    else {
      ingredients.splice(starterIndex, 1);
    }
  }
  return ingredients;
}

export default removeStarterIngredient;
