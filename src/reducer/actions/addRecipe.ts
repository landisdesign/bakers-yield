import { Recipe, ApplicationState } from "../state";
import createListAndMap from "./utils/createListAndMap";
import getIngredientChanges from "./utils/getIngredientChanges";
import updateIngredients from "./utils/updateIngredients";
import addStarterIngredient from "./utils/addStarterIngredient";
import sortNames from "../../utils/sortNames";

function prepare(recipe: Omit<Recipe, 'id'>) {
  return {
    payload: recipe
  }
}

function reducer(action: { payload: Omit<Recipe, 'id'> }, state: ApplicationState): ApplicationState {

  const recipeData = action.payload;

  const newRecipe = {
    ...recipeData,
    id: state.id
  };
  state.id++;

  const ingredientUpdates = getIngredientChanges(undefined, newRecipe);
  let [updatedIngredients, updatedID, recipe] = updateIngredients(ingredientUpdates, state.ingredients.list, state.id, newRecipe);

  if (recipe.isStarter) {
    [updatedIngredients, updatedID] = addStarterIngredient(updatedIngredients, updatedID, recipe);
  }

  state.id = updatedID;

  updatedIngredients.sort(sortNames);
  state.ingredients = createListAndMap(updatedIngredients);

  const updatedRecipes = state.recipes.list.concat(recipe).sort(sortNames);
  state.recipes = createListAndMap(updatedRecipes);

  return state;
}

export { prepare, reducer };
