import { Recipe, ApplicationState } from "../state";
import getIngredientChanges from "../utils/getIngredientChanges";
import updateIngredients from "../utils/updateIngredients";
import createListAndMap from "../utils/createListAndMap";
import removeStarterIngredient from "../utils/removeStarterIngredient";

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
  let [ingredients] = updateIngredients(ingredientChanges, state.ingredients.list, state.id);

  if (doomedRecipe.isStarter) {
    ingredients = removeStarterIngredient(ingredients, doomedRecipe.id);
  }

  state.ingredients = createListAndMap(ingredients);

  return state;
}

export { prepare, reducer };
