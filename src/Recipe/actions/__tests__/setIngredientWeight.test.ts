import createTestFormState from "../../../utils/testing/createTestFormState";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import setIngredientWeight from "../setIngredientWeight";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";
import textToNumber from "../utils/textToNumber";
import numberToText from "../utils/numberToText";

test('Updating ingredient updates recipe', () => {

  const initialState = createTestFormState();

  const expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 2);
  const expected = createTestFormState(expectedRecipe);

  const actual = setIngredientWeight(initialState, { payload: { row: 2, weight: numberToText(textToNumber(initialState.recipe.ingredients[2].weight) * 2) } })
  expect(actual).toEqual(expected);
});

test('Empty weight zeroes recipe', () => {

  const initialState = createTestFormState();

  const expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 0);
  const expected = createTestFormState(expectedRecipe);

  const actual = setIngredientWeight(initialState, { payload: { row: 2, weight: ''}})
  expect(actual).toEqual(expected);
});
