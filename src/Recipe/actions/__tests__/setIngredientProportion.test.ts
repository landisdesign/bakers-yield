import createTestFormState from "../../../utils/testing/createTestFormState";
import setIngredientProportion from "../setIngredientProportion";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";
import textToNumber from "../utils/textToNumber";
import numberToText from "../utils/numberToText";

test('Ingredient and total proportions, and ingredient weights, are updated properly', () => {

  const testRecipe = createTestTextRecipeData();

  const testState = createTestFormState(testRecipe);
  const testRow = 0;
  const testProportion = '10';

  let expectedRecipe = createTestTextRecipeData();
  expectedRecipe.ingredients[testRow].proportion = testProportion;
  expectedRecipe.totalProportion = expectedRecipe.ingredients.reduce((x, ingredient) => x + textToNumber(ingredient.proportion), 0);
  expectedRecipe.ingredients.forEach(ingredient => {
    ingredient.weight = numberToText(textToNumber(expectedRecipe.totalWeight) * textToNumber(ingredient.proportion) / expectedRecipe.totalProportion);
  });

  const expected = createTestFormState(expectedRecipe);

  const actual = setIngredientProportion(testState, { payload: { row: testRow, proportion: '' + testProportion } } );
  expect(actual).toEqual(expected);
});
