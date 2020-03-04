import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setTotalWeight from "../setTotalWeight";

test('Total weight updates ingredients and portion count', () => {

  const initialState = createTestFormState();
  const portionSize = initialState.recipe.totalWeight;
  initialState.recipe.portionSize = portionSize;
  initialState.recipe.portionCount = 1;

  const expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  expectedRecipe.portionSize = portionSize;
  expectedRecipe.portionCount = 2;
  const expected = createTestFormState(expectedRecipe);
  const testTotalWeight = expectedRecipe.totalWeight;

  const actual = setTotalWeight(initialState, { payload: '' + testTotalWeight });
  expect(actual).toEqual(expected);
});

test('Empty total weight zeroes ingredients and portion count', () => {

  const initialState = createTestFormState();
  const portionSize = initialState.recipe.totalWeight;
  initialState.recipe.portionSize = portionSize;
  initialState.recipe.portionCount = 1;

  const expectedRecipe = createTestRecipe(undefined, undefined, undefined, 0);
  expectedRecipe.portionSize = portionSize;
  expectedRecipe.portionCount = 0;
  const expected = createTestFormState(expectedRecipe);

  const actual = setTotalWeight(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});

test('Zero portion size returns zero portions', () => {

  const initialState = createTestFormState();
  initialState.recipe.portionSize = 0;
  initialState.recipe.portionCount = 1; // illegal, but it lets us see the change

  const expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  expectedRecipe.portionSize = 0;
  expectedRecipe.portionCount = 0;
  const expected = createTestFormState(expectedRecipe);
  const testTotalWeight = expectedRecipe.totalWeight;

  const actual = setTotalWeight(initialState, { payload: '' + testTotalWeight });
  expect(actual).toEqual(expected);

});
