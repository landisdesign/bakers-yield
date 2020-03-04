import { Recipe } from "../../../reducer/state";

const updateWeights = (recipe: Recipe, row: number, weight: number) => {

  if ((row !== -1) && !recipe.ingredients[row]?.proportion) {
    return recipe;
  }

  const newTotalWeight = row === -1 ? weight : weight * recipe.totalProportion / recipe.ingredients[row].proportion;
  recipe.totalWeight = newTotalWeight;
  recipe.ingredients.forEach((ingredient, i) => {
    ingredient.weight = (i === row) ? weight : newTotalWeight * ingredient.proportion / recipe.totalProportion;
  });
  recipe.portionCount = recipe.portionSize ? newTotalWeight / recipe.portionSize : 0;

  return recipe;
}

export default updateWeights;
