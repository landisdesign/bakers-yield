import createTestRecipe from "../../../utils/testing/createTestRecipe";
import createTestFormState from "../../../utils/testing/createTestFormState";
import removeIngredient from "../removeIngredient";

test('Removing ingredient updates total proportion and relative weights', () => {
  let testRecipe = createTestRecipe();

  const initialState = createTestFormState(testRecipe);

  let expectedRecipe = {
    ...testRecipe,
    ingredients: [...testRecipe.ingredients.slice(0, 2), ...testRecipe.ingredients.slice(3)]
  };
  expectedRecipe.totalProportion = expectedRecipe.totalWeight =
    expectedRecipe.ingredients.reduce((x, ingredient) => x + ingredient.proportion, 0)
  ;

  const expected = createTestFormState(expectedRecipe);

  const actual = removeIngredient(initialState, { payload: 2});
  expect(actual).toEqual(expected);
});
