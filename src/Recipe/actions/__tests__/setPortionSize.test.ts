import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setPortionSize from "../setPortionSize";

test('Changing portion size changes weights', () => {
  let initialRecipe = createTestRecipe();
  initialRecipe.portionSize = initialRecipe.totalWeight;
  initialRecipe.portionCount = 1;
  const initialState = createTestFormState(initialRecipe);

  const testSize = initialRecipe.portionSize * 2;

  let expectedRecipe = createTestRecipe(undefined, undefined, undefined, 2);
  expectedRecipe.portionCount = 1;
  expectedRecipe.portionSize = testSize;
  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionSize(initialState, { payload: testSize });
  expect(actual).toEqual(expected);
})
