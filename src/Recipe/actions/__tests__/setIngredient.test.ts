import createTestFormState from "../../../utils/testing/createTestFormState";
import setIngredient from "../setIngredient";
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

  const actualExactMatch = setIngredient(testState, { payload: { row: 1, name: testName } });
  expect(actualExactMatch).toEqual(expected);

  const actualDifferentCase = setIngredient(testState, { payload: { row: 1, name: testName.toUpperCase() } });
  expect(actualDifferentCase).toEqual(expected);
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

  const actual = setIngredient(testState, { payload: { row: 1, name: testName } });
  expect(actual).toEqual(expected);
});

test('Padded existing ingredient name populates a new ingredient name', () => {
  const testState = createTestFormState(undefined, defaultIngredientList);
  const testIngredients = testState.recipe.ingredients;
  const testName = defaultIngredientList[0].name + ' ';

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

  const actual = setIngredient(testState, { payload: { row: 1, name: testName } });
  expect(actual).toEqual(expected);
});
