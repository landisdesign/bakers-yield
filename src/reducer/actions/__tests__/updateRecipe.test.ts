import createTestRecipe from "../../utils/testing/createTestRecipe";
import { prepare, reducer } from "../updateRecipe";
import createTestIngredients from "../../utils/testing/createTestIngredients";
import createTestState from "../../utils/testing/createTestState";

describe('Prepare', () => {
  test('Payload filled properly', () => {
    const testRecipe = createTestRecipe();
    const expected = { payload: testRecipe };
    const actual = prepare(testRecipe);
    expect(actual).toEqual(expected);
  })
});

describe('Standard recipes', () => {

  test('Changing ingredients updates ingredients', () => {
    const initialIngredients = createTestIngredients();
    const initialRecipe = createTestRecipe('foo', false, initialIngredients.slice(0, 3));
    const initialState = createTestState(initialIngredients, [initialRecipe]);

    const testRecipe = createTestRecipe('foo', false, initialIngredients.slice(2));
    testRecipe.ingredients.push({
      ingredientID: 'a',
      weight: 0,
      proportion: 0,
      percentage: 0
    });

    const expectedRecipe = {
      ...testRecipe,
      ingredients: testRecipe.ingredients.map(
        ingredient => ingredient.ingredientID === 'a' ? {...ingredient, ingredientID: initialState.id} : {...ingredient}
      )
    };
    const expectedIngredients = [
      {
        id: initialState.id,
        name: 'a',
        recipeCount: 1
      }, // new ingredient
      initialIngredients[0], // default ingredient, unchanged
      initialIngredients[2], // single-use ingredient removed
      {
        ...initialIngredients[3],
        recipeCount: initialIngredients[3].recipeCount! + 1
      } // existing added ingredient
    ];

    const expected = createTestState(expectedIngredients, [expectedRecipe]);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });

  test('Changing name re-sorts recipe list', () => {
    const recipes = ([
      ['bar', 13],
      ['Baz', 14],
      ['foo', 12]
    ] as [string, number][]).map(([name, id]) => {
      let recipe = createTestRecipe(name, false);
      recipe.id = id;
      return recipe;
    });

    const initialState = createTestState(undefined, recipes);

    const testRecipe = {
      ...recipes[0],
      name: 'qux'
    };
    const expectedRecipes = [...recipes.slice(1), testRecipe];

    const expected = createTestState(undefined, expectedRecipes);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });

  test('Changing recipe to starter updates existing ingredient', () => {
    const testName = 'New starter';
    const testIngredient = {
      id: 25,
      name: testName,
      recipeCount: 2
    };

    let initialIngredients = createTestIngredients();
    initialIngredients.splice(1, 0, testIngredient);

    const initialRecipe = createTestRecipe(testName, false);
    const initialState = createTestState(initialIngredients, [initialRecipe]);

    const expectedIngredient = {
      ...testIngredient,
      starterRecipeID: initialRecipe.id
    };

    let expectedIngredients = [...initialIngredients];
    expectedIngredients[1] = expectedIngredient;

    const testRecipe = createTestRecipe(testName, true);
    const expected = createTestState(expectedIngredients, [testRecipe]);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });

  test('Changing recipe to starter adds new ingredient', () => {
    const testName = 'New starter';

    const initialRecipe = createTestRecipe(testName, false);
    const initialState = createTestState(undefined, [initialRecipe]);

    const expectedIngredient = {
      name: testName,
      id: initialState.id,
      starterRecipeID: initialRecipe.id,
      recipeCount: 0
    };

    let expectedIngredients = createTestIngredients();
    expectedIngredients.splice(1, 0, expectedIngredient);

    const testRecipe = createTestRecipe(testName, true);
    const expected = createTestState(expectedIngredients, [testRecipe]);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });
});

describe('Starter recipes', () => {

  test('Changing name changes ingredient list', () => {
    const initialIngredients = createTestIngredients();
    const initialName = initialIngredients[3].name;
    const initialRecipe = createTestRecipe(initialName, true, initialIngredients.slice(0, 3));
    const initialState = createTestState(initialIngredients, [initialRecipe]);

    const testName = 'New starter name';
    const testRecipe = createTestRecipe(testName, true, initialIngredients.slice(0, 3));

    let expectedIngredients = createTestIngredients();
    let [updatedIngredient] = expectedIngredients.splice(3, 1);
    updatedIngredient.name = testName;
    expectedIngredients.splice(1, 0, updatedIngredient);

    const expected = createTestState(expectedIngredients, [testRecipe]);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });

  test('Changing recipe to standard removes unused starter ingredient', () => {
    let initialIngredients = createTestIngredients();
    initialIngredients[3].recipeCount = 0;
    const name = initialIngredients[3].name;
    const initialRecipe = createTestRecipe(name, true, initialIngredients.slice(0,2));
    const initialState = createTestState(initialIngredients, [initialRecipe]);

    const expectedIngredients = createTestIngredients().slice(0, 3);
    const testRecipe = createTestRecipe(name, false, initialIngredients.slice(0,2));
    const expected = {
      ...createTestState(expectedIngredients, [testRecipe]),
      id: initialState.id
    };

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });

  test('Changing recipe to standard removes starter state from used ingredient', () => {
    const initialIngredients = createTestIngredients();
    const name = initialIngredients[3].name;
    const initialRecipe = createTestRecipe(name, true, initialIngredients.slice(0,2));
    const initialState = createTestState(initialIngredients, [initialRecipe]);

    let expectedIngredients = createTestIngredients();
    delete expectedIngredients[3].starterRecipeID;
    const testRecipe = createTestRecipe(name, false, initialIngredients.slice(0,2));
    const expected = createTestState(expectedIngredients, [testRecipe]);

    const testAction = prepare(testRecipe);
    const actual = reducer(testAction, initialState);
    expect(actual).toEqual(expected);
  });
});

