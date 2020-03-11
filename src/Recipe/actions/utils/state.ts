import { Recipe } from "../../../reducer/state";
import sanitizeText from "./sanitizeText";

export interface TextIngredientRatio {
  ingredientID: number | string;
  proportion: string;
  weight: string;
  percentage: number;
}

export interface TextRecipe {
  name: string;
  isStarter: boolean;
  ingredients:TextIngredientRatio[];
  totalWeight: string;
  totalProportion: number;
  measureByPortion: boolean;
  portionSize: string;
  portionCount: string;
}

export const textToNumberRecipe = (textRecipe: TextRecipe): Omit<Recipe, 'id'> => ({
  name: textRecipe.name,
  isStarter: textRecipe.isStarter,
  ingredients: textRecipe.ingredients.map(ingredient => ({
    ingredientID: ingredient.ingredientID,
    proportion: sanitizeText(ingredient.proportion),
    weight: sanitizeText(ingredient.weight),
    percentage: ingredient.percentage
  })),
  totalWeight: sanitizeText(textRecipe.totalWeight),
  totalProportion: textRecipe.totalProportion,
  measureByPortion: textRecipe.measureByPortion,
  portionSize: sanitizeText(textRecipe.portionSize),
  portionCount: sanitizeText(textRecipe.portionCount)
});

export const numberToTextRecipe = (recipe: Recipe): TextRecipe => ({
  name: recipe.name,
  isStarter: recipe.isStarter,
  ingredients: recipe.ingredients.map(ingredient => ({
    ingredientID: ingredient.ingredientID,
    proportion: '' + (ingredient.proportion || ''),
    weight: '' + (ingredient.weight || ''),
    percentage: ingredient.percentage
  })),
  totalWeight: '' + (recipe.totalWeight || ''),
  totalProportion: recipe.totalProportion,
  measureByPortion: recipe.measureByPortion,
  portionSize: '' + (recipe.portionSize || ''),
  portionCount: '' + (recipe.portionCount || '')
});
