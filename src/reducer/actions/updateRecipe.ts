import { Recipe, ApplicationState } from "../state";
import getIngredientChanges from "./utils/getIngredientChanges";
import updateIngredients from "./utils/updateIngredients";
import removeStarterIngredient from "./utils/removeStarterIngredient";
import addStarterIngredient from "./utils/addStarterIngredient";
import sortNames from "../../utils/sortNames";
import createListAndMap from "./utils/createListAndMap";

function prepare(recipe: Recipe) {
  return { payload: recipe };
}

function reducer(action: { payload: Recipe }, state: ApplicationState): ApplicationState {

  let updatedRecipe = {
    ...action.payload,
    ingredients: action.payload.ingredients.map(x => ({...x}))
  };
  const originalRecipe = state.recipes.map[updatedRecipe.id];
  const recipeIndex = state.recipes.list.findIndex(recipe => recipe.id === updatedRecipe.id);

  const ingredientChanges = getIngredientChanges(originalRecipe, updatedRecipe);
  let ingredients, nextID;
  [ingredients, nextID, updatedRecipe] = updateIngredients(ingredientChanges, state.ingredients.list, state.id, updatedRecipe);

  if (originalRecipe.isStarter) {
    if (!updatedRecipe.isStarter) {
      ingredients = removeStarterIngredient(ingredients, updatedRecipe.id);
    }
    else if (originalRecipe.name !== updatedRecipe.name) {
      const starterIngredient = ingredients.find(ingredient => ingredient.starterRecipeID === updatedRecipe.id);
      if (starterIngredient) {
        starterIngredient.name = updatedRecipe.name;
      }
    }
  }
  else if (updatedRecipe.isStarter) {
    [ingredients, nextID] = addStarterIngredient(ingredients, nextID, updatedRecipe);
  }

  ingredients.sort(sortNames);
  state.ingredients = createListAndMap(ingredients);

  state.recipes.list[recipeIndex] = state.recipes.map[updatedRecipe.id] = updatedRecipe;
  state.recipes.list.sort(sortNames);

  state.id = nextID;

  return state;
}

export { prepare, reducer };
