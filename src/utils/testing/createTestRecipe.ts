import { Ingredient, Recipe } from "../../reducer/state";
import createTestIngredients from "./createTestIngredients";

const createTestRecipe = (
  name: string = 'foo',
  isStarter: boolean = false,
  ingredients: Ingredient[] = createTestIngredients(),
  weightFactor: number = 1
): Recipe => ({
  name,
  isStarter,
  id: 6,
  portionCount: weightFactor,
  measureByPortion: false,
  ingredients: ingredients.map((ingredient, index) => ({
    ingredientID: ingredient.id,
    weight: (index + 1) * weightFactor,
    proportion: index + 1,
    percentage: 0
  })),
  ...ingredients.reduce((props, _, index) => {
    props.totalWeight += (index + 1) * weightFactor;
    props.totalProportion += index + 1;
    props.portionSize += index + 1;
    return props;
  }, {
    totalWeight: 0,
    totalProportion: 0,
    portionSize: 0
  })
});

export default createTestRecipe;
