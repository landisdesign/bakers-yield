import createTestRecipe from "../../../utils/testing/createTestRecipe";
import createTestFormState from "../../../utils/testing/createTestFormState";
import setIngredientProportion from "../setIngredientProportion";

test('Ingredient and total proportions, and ingredient weights, are updated properly', () => {

  const testRecipe = createTestRecipe();

  const testState = createTestFormState(testRecipe);
  const testRow = 0;
  const testProportion = 10;

  let expectedRecipe = createTestRecipe();
  expectedRecipe.ingredients[testRow].proportion = testProportion;
  expectedRecipe.totalProportion = expectedRecipe.ingredients.reduce((x, ingredient) => x + ingredient.proportion, 0);
  expectedRecipe.ingredients.forEach(ingredient => {
    ingredient.weight = expectedRecipe.totalWeight * ingredient.proportion / expectedRecipe.totalProportion;
  });

  const expected = createTestFormState(expectedRecipe);

  const actual = setIngredientProportion(testState, { payload: { row: testRow, proportion: '' + testProportion } } );
  expect(actual).toEqual(expected);
});
