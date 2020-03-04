import { Recipe, Ingredient } from "../../reducer/state";
import { FormState } from "../../Recipe/Form";
import createTestRecipe from "./createTestRecipe";

const createTestFormState = (recipe: Recipe = createTestRecipe(), ingredients: Ingredient[] = []): FormState => ({
  edit: false,
  readonly: false,
  recipe,
  ingredients,
  ingredientsMap: ingredients.reduce((map, ingredient) => {
    map[ingredient.name.toLowerCase()] = ingredient.id;
    return map;
  }, {} as {[index:string]: number}),
  ingredientMatchText: ingredients.reduce((text, ingredient) => text + ingredient.name + '¬' + ingredient.id + '\n', '')
});

export default createTestFormState;
