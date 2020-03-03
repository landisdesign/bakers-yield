import { Ingredient, Recipe, ApplicationState } from "../../reducer/state";
import createTestIngredients from "./createTestIngredients";
import createTestRecipe from "./createTestRecipe";
import createListAndMap from "../../reducer/actions/utils/createListAndMap";

const createTestState = (ingredients: Ingredient[] = createTestIngredients(), recipes: Recipe[] = [createTestRecipe('foo', false, ingredients)]): ApplicationState => ({
  id: Math.max(recipes.reduce((max, recipe) => Math.max(max, recipe.id), 0), ingredients.reduce((max, ingredient) => Math.max(max, ingredient.id), 0)) + 1,
  ingredients: createListAndMap(ingredients),
  recipes: createListAndMap(recipes)
});

export default createTestState;
