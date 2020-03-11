import updateWeights from "../updateWeights";
import createTestTextRecipeData from "../../../../utils/testing/createTestTextRecipeData";

const buildTestRecipes = (weightFactor: number = 2) => {
  let initialRecipe = createTestTextRecipeData();

  let expected = createTestTextRecipeData(undefined, undefined, undefined, weightFactor);

  return {
    initialRecipe,
    expected
  };
}

test('Updating ingredient updates all weights', () => {
  const {
    initialRecipe,
    expected
  } = buildTestRecipes();

  const actual = updateWeights(initialRecipe, 2, expected.ingredients[2].weight);
  expect(actual).toEqual(expected);
});

test('Updating total updates all ingredients', () => {
  const {
    initialRecipe,
    expected
  } = buildTestRecipes();

  const actual = updateWeights(initialRecipe, -1, expected.totalWeight);
  expect(actual).toEqual(expected);
});

test('Setting zero weights zeroes out entire recipe', () => {
  const {
    initialRecipe,
    expected
  } = buildTestRecipes(0);

  let actual = updateWeights(initialRecipe, -1, 0);
  expect(actual).toEqual(expected);

  const {
    initialRecipe: initialRecipe2
  } = buildTestRecipes();

  actual = updateWeights(initialRecipe2, 2, 0);
  expect(actual).toEqual(expected);
});
