import { Ingredient, Recipe } from "../../reducer/state";
import createTestIngredients from "./createTestIngredients";

const createTestRecipe = (name: string = 'foo', isStarter: boolean = false, ingredients: Ingredient[] = createTestIngredients()): Recipe => ({
  name,
  isStarter,
  id: 6,
  portionSize: 0,
  portionCount: 0,
  totalWeight: 0,
  totalProportion: 0,
  measureByPortion: false,
  ingredients: ingredients.map(ingredient => ({
    ingredientID: ingredient.id,
    weight: 0,
    proportion: 0,
    percentage: 0
  }))
});

export default createTestRecipe;
