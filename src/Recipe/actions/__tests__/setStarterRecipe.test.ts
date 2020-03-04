import createTestFormState from "../../../utils/testing/createTestFormState";
import setStarterRecipe from "../setStarterRecipe";

test('Starter recipe flag updated', () => {

  const initialState = createTestFormState();

  let expected = createTestFormState();
  expected.recipe.isStarter = true;

  const actual = setStarterRecipe(initialState, { payload: true });
  expect(actual).toEqual(expected);
});
