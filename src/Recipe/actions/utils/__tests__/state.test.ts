import { TextRecipe, numberToTextRecipe, textToNumberRecipe } from "../state";
import { Recipe } from "../../../../reducer/state";

test('Convert real recipe to text data', () => {
  const testRecipe = {
    id: 2,
    ...createRealRecipeWithoutID()
  };

  const expected = createTextRecipe(true);
  const actual = numberToTextRecipe(testRecipe);
  expect(actual).toEqual(expected);
})

test('Convert text data to recipe data', () => {
  const testRecipe = createTextRecipe(false);

  const expected = createRealRecipeWithoutID();
  const actual = textToNumberRecipe(testRecipe);
  expect(actual).toEqual(expected);
})

const createTextRecipe = (expected: boolean): TextRecipe => ({
  ...commonProperties,
  portionCount: '2',
  portionSize: '0.25',
  totalWeight: expected ? '' : '.',
  ingredients: [
    {
      ingredientID: 1,
      proportion: '3',
      weight: '',
      percentage: 5
    }
  ]
});

const createRealRecipeWithoutID = (): Omit<Recipe, 'id'> => ({
  ...commonProperties,
  portionCount: 2,
  portionSize: 0.25,
  totalWeight: 0,
  ingredients: [
    {
      ingredientID: 1,
      proportion: 3,
      weight: 0,
      percentage: 5
    }
  ]
});

const commonProperties = {
  name: 'foo',
  isStarter: true,
  measureByPortion: false,
  totalProportion: 3
};
