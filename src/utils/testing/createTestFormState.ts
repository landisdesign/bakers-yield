import { Ingredient } from "../../reducer/state";
import { FormState } from "../../Recipe";
import createTestTextRecipeData from "./createTestTextRecipeData";
import { TextRecipe } from "../../Recipe/actions/utils/state";

const createTestFormState = (recipe: TextRecipe = createTestTextRecipeData(), ingredients: Ingredient[] = []): FormState => ({
  edit: false,
  readonly: false,
  recipe,
  ingredients,
  ingredientsMap: ingredients.reduce((map, ingredient) => {
    map[ingredient.name.toLowerCase()] = ingredient.id;
    return map;
  }, {} as {[index:string]: number})
});

export default createTestFormState;
