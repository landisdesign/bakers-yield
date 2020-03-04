import { Recipe } from "../../../reducer/state";
import setRecipeName from "../setRecipeName";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import createTestFormState from "../../../utils/testing/createTestFormState";

test('Payload name updates recipe name', () => {
  const testName = 'foo';
  const testRecipe: Recipe = createTestRecipe('bar');

  const initialState = createTestFormState(testRecipe);

  const expected = {
    ...initialState,
    recipe: {
      ...testRecipe,
      name: testName
    }
  };

  const actual = setRecipeName(initialState, { payload: testName });
  expect(actual).toEqual(expected);
});
