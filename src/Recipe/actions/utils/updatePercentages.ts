import { TextRecipe } from "./state";
import textToNumber from "./textToNumber";

const updatePercentages = (recipe: TextRecipe): TextRecipe => {
  const total = recipe.totalProportion;
  if (!total) {
    return recipe;
  }

  recipe.ingredients.forEach(ingredient => {
    ingredient.percentage = Math.round(100 * textToNumber(ingredient.proportion) / total);
  });
  return recipe;
};

export default updatePercentages;
