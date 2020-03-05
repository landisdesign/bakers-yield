import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setPortionCount from "../setPortionCount";

test('Updating portion count updates weights', () => {
  const initialState = createTestFormState();

  let expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);

  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionCount(initialState, { payload: '2' });
  expect(actual).toEqual(expected);
});

test('Empty portion count zeroes weights', () => {
  const initialState = createTestFormState();

  let expectedRecipe = createTestRecipe(undefined, undefined, undefined, 0);

  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionCount(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});
