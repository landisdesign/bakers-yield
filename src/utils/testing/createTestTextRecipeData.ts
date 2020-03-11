import { TextRecipe } from "../../Recipe/actions/utils/state";
import { Ingredient } from "../../reducer/state";
import createTestIngredients from "./createTestIngredients";
import numberToText from "../../Recipe/actions/utils/numberToText";

const createTestTextRecipeData = (
  name: string = 'foo',
  isStarter: boolean = false,
  ingredients: Ingredient[] = createTestIngredients(),
  weightFactor: number = 1
): TextRecipe => ({
  name,
  isStarter,
  ingredients: ingredients.map((ingredient, index) => ({
    ingredientID: ingredient.id,
    proportion: numberToText(index + 1),
    weight: numberToText((index + 1) * weightFactor),
    percentage: Math.round(100 * (index + 1) / getTotalFromCount(ingredients.length))
  })),
  totalWeight: numberToText(getTotalFromCount(ingredients.length) * weightFactor),
  totalProportion: getTotalFromCount(ingredients.length),
  measureByPortion: false,
  portionSize: numberToText(getTotalFromCount(ingredients.length)),
  portionCount: numberToText(weightFactor)
});

export default createTestTextRecipeData;

const getTotalFromCount = (count: number) => {
  const mod = count % 2;
  const largestEven = count - mod;
  const finalElement = count * mod;
  return ((1 + largestEven) * largestEven / 2) + finalElement;
}
