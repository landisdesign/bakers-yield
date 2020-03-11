import createTestFormState from "../../../utils/testing/createTestFormState";
import setPortionSize from "../setPortionSize";
import textToNumber from "../utils/textToNumber";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";
import numberToText from "../utils/numberToText";

test('Changing portion size changes weights', () => {
  const initialState = createTestFormState();

  const testSize = textToNumber(initialState.recipe.portionSize) * 2;

  let expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 2);
  expectedRecipe.portionCount = '1';
  expectedRecipe.portionSize = numberToText(testSize);
  const expected = createTestFormState(expectedRecipe);

  const actual = setPortionSize(initialState, { payload: numberToText(testSize) });
  expect(actual).toEqual(expected);
});

test('Empty portion size has no effect on weight or count', () => {
  const initialState = createTestFormState();

  let expected = createTestFormState();
  expected.recipe.portionSize = '';

  const actual = setPortionSize(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});
