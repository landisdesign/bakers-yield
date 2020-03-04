import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setPortionCount from "../setPortionCount";

test('Updating portion count updates weights', () => {
  const initialState = createTestFormState();
  let portionSize = initialState.recipe.totalWeight;
  initialState.recipe.portionSize = portionSize;
  initialState.recipe.portionCount = 1;

  let expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  expectedRecipe.portionSize = portionSize;
  expectedRecipe.portionCount = 2;

  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionCount(initialState, { payload: 2 });
  expect(actual).toEqual(expected);
});
