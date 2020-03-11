import sanitizeText from "./sanitizeText";
import { TextRecipe } from "./state";
import sanitizeNumber from "./sanitizeNumber";

const updateWeights = (recipe: TextRecipe, row: number, weight: string | number) => {

  if ((row !== -1) && !recipe.ingredients[row]?.proportion) {
    return recipe;
  }

  const proportion = row !== -1 ? sanitizeText(recipe.ingredients[row].proportion) : 0;
  const sanitizedWeight = typeof weight === 'number' ? weight : sanitizeText(weight);
  const weightText = typeof weight === 'number' ? sanitizeNumber(weight) : weight;
  const newTotalWeight = row === -1 ? sanitizedWeight : sanitizedWeight * recipe.totalProportion / proportion;
  recipe.totalWeight = sanitizeNumber(newTotalWeight);
  recipe.ingredients.forEach((ingredient, i) => {
    ingredient.weight = (i === row) ? weightText : sanitizeNumber(newTotalWeight * sanitizeText(ingredient.proportion) / recipe.totalProportion);
  });
  recipe.portionCount = recipe.portionSize ? sanitizeNumber(newTotalWeight / sanitizeText(recipe.portionSize)) : '';

  return recipe;
}

export default updateWeights;
