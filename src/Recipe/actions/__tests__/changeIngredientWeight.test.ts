import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import changeIngredientWeight from "../changeIngredientWeight";

const createInitialState = () => {
  const testRecipe = createTestRecipe();
  testRecipe.ingredients.forEach((ingredient, index) => {
    ingredient.proportion = ingredient.weight = index + 1;
  });
  testRecipe.totalProportion = testRecipe.totalWeight = testRecipe.ingredients.reduce((x, ingredient) => x + ingredient.proportion, 0);
  return createTestFormState(testRecipe);
};

test('Updating ingredient updates recipe', () => {

  const initialState = createInitialState();

  const expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  const expected = createTestFormState(expectedRecipe);

  const actual = changeIngredientWeight(initialState, { payload: { row: 2, weight: '' + initialState.recipe.ingredients[2].weight * 2}})
  expect(actual).toEqual(expected);
});

test('Empty weight zeroes recipe', () => {

  const initialState = createInitialState();

  const expectedRecipe = createTestRecipe(undefined, undefined, undefined, 0);
  const expected = createTestFormState(expectedRecipe);

  const actual = changeIngredientWeight(initialState, { payload: { row: 2, weight: ''}})
  expect(actual).toEqual(expected);
});
