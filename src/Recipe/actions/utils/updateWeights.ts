import textToNumber from "./textToNumber";
import { TextRecipe } from "./state";
import numberToText from "./numberToText";

const updateWeights = (recipe: TextRecipe, row: number, weight: string | number) => {

  if ((row !== -1) && !recipe.ingredients[row]?.proportion) {
    return recipe;
  }

  const proportion = row !== -1 ? textToNumber(recipe.ingredients[row].proportion) : 0;
  const sanitizedWeight = typeof weight === 'number' ? weight : textToNumber(weight);
  const weightText = typeof weight === 'number' ? numberToText(weight) : weight;
  const newTotalWeight = row === -1 ? sanitizedWeight : sanitizedWeight * recipe.totalProportion / proportion;
  recipe.totalWeight = numberToText(newTotalWeight);
  recipe.ingredients.forEach((ingredient, i) => {
    ingredient.weight = (i === row) ? weightText : numberToText(newTotalWeight * textToNumber(ingredient.proportion) / recipe.totalProportion);
  });
  recipe.portionCount = recipe.portionSize ? numberToText(newTotalWeight / textToNumber(recipe.portionSize)) : '';

  return recipe;
}

export default updateWeights;
