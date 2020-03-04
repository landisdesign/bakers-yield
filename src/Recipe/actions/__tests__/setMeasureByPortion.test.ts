import createTestFormState from "../../../utils/testing/createTestFormState";
import setMeasureByPortion from "../setMeasureByPortion";

test('measureByPortion changed', () => {

  const initialState = createTestFormState();
  let expected = createTestFormState();
  expected.recipe.measureByPortion = true;

  const actual = setMeasureByPortion(initialState, { payload: true });
  expect(actual).toEqual(expected);
});
