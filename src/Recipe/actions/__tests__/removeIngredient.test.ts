import createTestFormState from "../../../utils/testing/createTestFormState";
import removeIngredient from "../removeIngredient";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";
import textToNumber from "../utils/textToNumber";
import numberToText from "../utils/numberToText";

test('Removing ingredient updates total proportion and relative weights', () => {
  let testRecipe = createTestTextRecipeData();

  const initialState = createTestFormState(testRecipe);

  let expectedRecipe = {
    ...testRecipe,
    ingredients: [...testRecipe.ingredients.slice(0, 2), ...testRecipe.ingredients.slice(3)]
  };
  expectedRecipe.totalProportion =
    (expectedRecipe.ingredients.reduce((x, ingredient) => x + textToNumber(ingredient.proportion), 0))
  ;

  expectedRecipe.totalWeight = numberToText(expectedRecipe.totalProportion);
  expectedRecipe.portionCount = numberToText(expectedRecipe.totalProportion / textToNumber(expectedRecipe.portionSize));

  const expected = createTestFormState(expectedRecipe);

  const actual = removeIngredient(initialState, { payload: 2});
  expect(actual).toEqual(expected);
});
