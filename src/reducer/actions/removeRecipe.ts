import { Recipe, ApplicationState } from "../state";
import getIngredientChanges from "../utils/getIngredientChanges";
import updateIngredients from "../utils/updateIngredients";
import createListAndMap from "../utils/createListAndMap";

function prepare(recipe: Recipe) {
  return { payload: recipe.id };
}

function reducer(action: {payload: number}, state: ApplicationState) : ApplicationState {

  const recipeID = action.payload;
  const doomedRecipe = state.recipes.map[recipeID];
  const doomedRecipeIndex = state.recipes.list.findIndex(recipe => recipe.id === recipeID);

  delete state.recipes.map[recipeID];
  if (doomedRecipeIndex !== -1) {
    state.recipes.list.splice(doomedRecipeIndex, 1);
  }

  const ingredientChanges = getIngredientChanges(doomedRecipe);
  const [ingredients] = updateIngredients(ingredientChanges, state.ingredients.list, state.id);

  if (doomedRecipe.isStarter) {
    const starterRecipeIndex = ingredients.findIndex(ingredient => ingredient.starterRecipeID === doomedRecipe.id);
    if (starterRecipeIndex !== -1) {
      const starterRecipeIngredient = ingredients[starterRecipeIndex];
      if (starterRecipeIngredient.recipeCount) {
        delete starterRecipeIngredient.starterRecipeID;
      }
      else {
        ingredients.splice(starterRecipeIndex, 1);
      }
    }
  }

  state.ingredients = createListAndMap(ingredients);

  return state;
}

export { prepare, reducer };
