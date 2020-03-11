import createTestFormState from "../../../utils/testing/createTestFormState";
import setPortionCount from "../setPortionCount";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";

test('Updating portion count updates weights', () => {
  const initialState = createTestFormState();

  let expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 2);

  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionCount(initialState, { payload: '2' });
  expect(actual).toEqual(expected);
});

test('Empty portion count zeroes weights', () => {
  const initialState = createTestFormState();

  let expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 0);

  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionCount(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});
