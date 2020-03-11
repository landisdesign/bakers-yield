import createTestFormState from "../../../utils/testing/createTestFormState";
import setTotalWeight from "../setTotalWeight";
import createTestTextRecipeData from "../../../utils/testing/createTestTextRecipeData";

test('Total weight updates ingredients and portion count', () => {

  const initialState = createTestFormState();
  const portionSize = initialState.recipe.totalWeight;
  initialState.recipe.portionSize = portionSize;
  initialState.recipe.portionCount = '1';

  const expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 2);
  expectedRecipe.portionSize = portionSize;
  expectedRecipe.portionCount = '2';
  const expected = createTestFormState(expectedRecipe);
  const testTotalWeight = expectedRecipe.totalWeight;

  const actual = setTotalWeight(initialState, { payload: '' + testTotalWeight });
  expect(actual).toEqual(expected);
});

test('Empty total weight zeroes ingredients and portion count', () => {

  const initialState = createTestFormState();
  const portionSize = initialState.recipe.totalWeight;
  initialState.recipe.portionSize = portionSize;
  initialState.recipe.portionCount = '1';

  const expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 0);
  expectedRecipe.portionSize = portionSize;
  expectedRecipe.portionCount = '';
  const expected = createTestFormState(expectedRecipe);

  const actual = setTotalWeight(initialState, { payload: '' });
  expect(actual).toEqual(expected);
});

test('Zero portion size returns zero portions', () => {

  const initialState = createTestFormState();
  initialState.recipe.portionSize = '';
  initialState.recipe.portionCount = '1'; // illegal, but it lets us see the change

  const expectedRecipe = createTestTextRecipeData(undefined, undefined, undefined, 2);
  expectedRecipe.portionSize = '';
  expectedRecipe.portionCount = '';
  const expected = createTestFormState(expectedRecipe);
  const testTotalWeight = expectedRecipe.totalWeight;

  const actual = setTotalWeight(initialState, { payload: '' + testTotalWeight });
  expect(actual).toEqual(expected);

});
