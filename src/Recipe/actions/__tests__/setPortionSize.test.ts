import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setPortionSize from "../setPortionSize";

test('Changing portion size changes weights', () => {
  const initialState = createTestFormState();

  const testSize = initialState.recipe.portionSize * 2;

  let expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  expectedRecipe.portionCount = 1;
  expectedRecipe.portionSize = testSize;
  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionSize(initialState, { payload: '' + testSize });
  expect(actual).toEqual(expected);
});

test('Empty portion size has no effect on weight or count', () => {
  const initialState = createTestFormState();

  let expected = createTestFormState();
  expected.recipe.portionSize = 0;

  const actual = setPortionSize(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});
