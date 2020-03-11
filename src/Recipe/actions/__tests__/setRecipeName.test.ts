import setRecipeName from "../setRecipeName";
import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";

test('Payload name updates recipe name', () => {
  const testName = 'foo';
  const testRecipe = createTestTextRecipeData('bar');

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
