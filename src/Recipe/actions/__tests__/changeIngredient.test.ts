import createTestFormState from "../../../utils/testing/createTestFormState";
import changeIngredient from "../changeIngredient";
import { defaultIngredientList } from "../../../reducer/state";

test('Existing ingredient populates ingredient ID', () => {
  const testState = createTestFormState(undefined, defaultIngredientList);
  const testIngredients = testState.recipe.ingredients;
  const testName = testState.ingredients[0].name;

  let expectedIngredients = [...testIngredients];
  expectedIngredients[1] = {
    ...expectedIngredients[1],
    ingredientID: expectedIngredients[0].ingredientID
  };

  const expected = {
    ...testState,
    recipe: {
      ...testState.recipe,
      ingredients: expectedIngredients
    }
  };

  const actualExactMatch = changeIngredient(testState, { payload: { row: 1, name: testName } });
  expect(actualExactMatch).toEqual(expected);

  const actualDifferentCase = changeIngredient(testState, { payload: { row: 1, name: testName.toUpperCase() } });
  expect(actualDifferentCase).toEqual(expected);

  const actualPaddedCase = changeIngredient(testState, { payload: { row: 1, name: `  ${testName}  ` } });
  expect(actualPaddedCase).toEqual(expected);
});

test('New ingredient populates ingredient name', () => {
  const testState = createTestFormState(undefined, defaultIngredientList);
  const testIngredients = testState.recipe.ingredients;
  const testName = 'baz';

  let expectedIngredients = [...testIngredients];
  expectedIngredients[1] = {
    ...expectedIngredients[1],
    ingredientID: testName
  };

  const expected = {
    ...testState,
    recipe: {
      ...testState.recipe,
      ingredients: expectedIngredients
    }
  };

  const actual = changeIngredient(testState, { payload: { row: 1, name: testName } });
  expect(actual).toEqual(expected);
});
