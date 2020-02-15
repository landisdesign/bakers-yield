import reducer, { addRecipe, removeRecipe, updateRecipe, sortRecipes, __internal_actions_for_testing_purposes_only__ } from '../recipesSlice';
import { Recipe, Ingredient } from '../state';
import { addStarterRecipe, mergeIngredients, removeStarterRecipe } from '../ingredientsSlice';
import { RootState } from '..';
import { Action } from 'redux';

const testRecipeBase: Omit<Recipe, 'name' | 'id'> = {
  isStarter: false,
  measureByPortion: false,
  portionSize: 0,
  portionCount: 0,
  totalWeight: 0,
  totalProportion: 0,
  ingredients: [
    {
      ingredient: 'a',
      proportion: 0,
      percentage: 0,
      weight: 0
    },
    {
      ingredient: 'b',
      proportion: 0,
      percentage: 0,
      weight: 0
    }
  ]
};

describe('Synchronous action creators return proper actions', () => {

  test('sortRecipes', () => {
    let expected = {
      type: sortRecipes.toString(),
      payload: {
        sortByID: false,
        sortDescending: false
      }
    };
    let actual = sortRecipes(false, false);
    expect(actual).toEqual(expected);

    expected.payload = {
      sortByID: true,
      sortDescending: false
    };
    actual = sortRecipes(true, false);
    expect(actual).toEqual(expected);

    expected.payload = {
      sortByID: false,
      sortDescending: true
    };
    actual = sortRecipes(false, true);
    expect(actual).toEqual(expected);

    expected.payload = {
      sortByID: true,
      sortDescending: true
    };
    actual = sortRecipes(true, true);
    expect(actual).toEqual(expected);
  });
});

describe('Internal actions update state properly', () => {

  const initialState = (): RecipesState => {
    const list: Recipe[] = (new Array(5)).fill(null).map((_, i) => ({
      ...testRecipeBase,
      name: String.fromCharCode(i + 'a'.charCodeAt(0)),
      id: i + 1,
    }));
    const map = list.reduce((acc, recipe) => {
        acc[recipe.id] = recipe;
        return acc;
      },
      {} as {[index: number]: Recipe}
    );
    return {
      id: list.length,
      list,
      map,
      sortDescending: false,
      sortByID: false
    };
  };

  test('Adding a recipe', () => {
    const initial = initialState();
    const test = {
      ...testRecipeBase,
      name: 'aa'
    };
    const expectedRecipe = {
      ...test,
      id: initial.id + 1
    };
    let list = [...initial.list];
    list.splice(1, 0, expectedRecipe);

    const expected = {
      ...initial,
      id: initial.id + 1,
      list,
      map: {
        ...initial.map,
        [expectedRecipe.id]: expectedRecipe
      }
    };

    const action = __internal_actions_for_testing_purposes_only__.add(test);
    const actual = reducer(initial, action);
    expect(actual).toEqual(expected);
  });

  test('Removing a recipe', () => {
    const initial = initialState();
    let list = [...initial.list];
    list.splice(1, 1);
    let map = {...initial.map};
    delete map[2];

    const expected = {
      ...initial,
      list,
      map
    };

    const action = __internal_actions_for_testing_purposes_only__.remove(2);
    const actual = reducer(initial, action);
    expect(actual).toEqual(expected);
  });

  test('Updating a recipe', () => {
    const initial = initialState();
    let list = [...initial.list];
    const newRecipe = {
      ...list.splice(2, 1)[0],
      name: 'foo',
      measureByPortion: true
    };
    list.push(newRecipe);

    const map = {
      ...initial.map,
      [newRecipe.id]: newRecipe
    }

    const expected = {
      ...initial,
      list,
      map
    };

    const action = __internal_actions_for_testing_purposes_only__.update(newRecipe);
    const actual = reducer(initial, action);
    expect(actual).toEqual(expected);
  });
});

describe('Public actions update state properly', () => {

  const testRecipe = {
    ...testRecipeBase,
    name: 'foo'
  };

  const testRecipeWithID = {
    ...testRecipe,
    id: 2
  }

  const getState = (): RootState => ({
    ingredients: [] as Ingredient[],
    recipes: {
      id: 2,
      list: [testRecipeWithID],
      map: { 2: testRecipeWithID },
      sortByID: false,
      sortDescending: false
    }
  });

  test('Adding standard recipe updates properly', () => {
    const testRecipe = {
      ...testRecipeBase,
      name: 'foo'
    };
    const expected = __internal_actions_for_testing_purposes_only__.add(testRecipe);

    const actual = getThunkActions(addRecipe(testRecipe), getState);
    expect(actual).toHaveLength(1);
    expect(actual.actions[0]).toEqual(expected);
  });

  test('Adding starter recipe updates recipes and ingredients', async () => {
    const testRecipe = {
      ...testRecipeBase,
      name: 'bar',
      isStarter: true
    };
    const expectedFirstAction = __internal_actions_for_testing_purposes_only__.add(testRecipe);

    let actual = getThunkActions(addRecipe(testRecipe), getState);
    expect(actual).toHaveLength(2);
    expect(actual.actions).toHaveLength(1);
    expect(actual.actions[0]).toEqual(expectedFirstAction);

    const internalThunk = actual.thunks[0]; // the async function returned to dispatch

    const updatedRecipe = {
      ...testRecipe,
      id: 3,
      isStarter: true
    };
    const expectedSecondAction = addStarterRecipe(updatedRecipe);

    let updatedState = getState();
    updatedState.recipes.id = updatedRecipe.id;
    updatedState.recipes.list.push(updatedRecipe);
    updatedState.recipes.map[updatedRecipe.id] = updatedRecipe;
    const getUpdatedState = () => updatedState;

    actual = getThunkActions(internalThunk, getUpdatedState);
    expect(actual).toHaveLength(1);
    expect(actual.actions).toHaveLength(1);
    expect(actual.actions[0]).toEqual(expectedSecondAction);
   });

  test('Removing standard recipe updates properly', () => {
    const initState = getState();
    const testRecipe = {
      ...initState.recipes.list[0]
    };
    const removedIngredients = {
      remove: testRecipe.ingredients.map(ingredient => ingredient.ingredient)
    };
    const expected = [
      mergeIngredients(removedIngredients),
      __internal_actions_for_testing_purposes_only__.remove(testRecipe.id)
    ];

    const actual = getThunkActions(removeRecipe(testRecipe), getState);
    expect(actual.actions).toEqual(expected);
  });

  test('Removing starter recipe updates recipes and ingredients', () => {
    const initState = getState();
    const testRecipe = {
      ...initState.recipes.list[0],
      isStarter: true
    };
    const removedIngredients = {
      remove: testRecipe.ingredients.map(ingredient => ingredient.ingredient)
    };
    const expected = [
      removeStarterRecipe(testRecipe),
      mergeIngredients(removedIngredients),
      __internal_actions_for_testing_purposes_only__.remove(testRecipe.id)
    ];

    const actual = getThunkActions(removeRecipe(testRecipe), () => initState);
    expect(actual.actions).toEqual(expected);
  });

  test('Updating standard recipe updates properly', () => {
    const initState = getState();
    const originalRecipe = initState.recipes.list[0];
    const testRecipe = {
      ...originalRecipe,
      name: 'bar'
    };
    const expected = [
      __internal_actions_for_testing_purposes_only__.update(testRecipe)
    ];

    const actual = getThunkActions(updateRecipe(testRecipe), () => initState);
    expect(actual.actions).toEqual(expected);
  });

  test('Updating recipe ingredients dispatches properly', () => {
    const initState = getState();
    const originalRecipe = initState.recipes.list[0];
    const testRecipe = {
      ...originalRecipe,
      ingredients: originalRecipe.ingredients.map(ingredient => ingredient.ingredient === 'b' ? {...ingredient, ingredient: 'c'} : ingredient)
    };
    const expected = [
      mergeIngredients({add: ['c'], remove: ['b']}),
      __internal_actions_for_testing_purposes_only__.update(testRecipe)
    ];

    const actual = getThunkActions(updateRecipe(testRecipe), () => initState);
    expect(actual.actions).toEqual(expected);
  });

  test('Changing from starter recipe status also dispatches ingredients update to starter recipe status', () => {
    let initState = getState();
    let testRecipe = {
      ...initState.recipes.list[0],
      isStarter: true
    };
    const expectedToStarter = [
      addStarterRecipe(testRecipe),
      __internal_actions_for_testing_purposes_only__.update(testRecipe)
    ];

    let actual = getThunkActions(updateRecipe(testRecipe), getState);
    expect(actual.actions).toEqual(expectedToStarter);

    testRecipe = {
      ...initState.recipes.list[0]
    };
    initState.recipes.list[0].isStarter = true;
    const expectedFromStarter = [
      removeStarterRecipe(testRecipe),
      __internal_actions_for_testing_purposes_only__.update(testRecipe)
    ];

    actual = getThunkActions(updateRecipe(testRecipe), () => initState);
    expect(actual.actions).toEqual(expectedFromStarter);
  });

  test('Changing the name of a starter recipe updates recipes and ingredients', () => {
    let initState = getState();
    initState.recipes.list[0].isStarter = true;
    let testRecipe = {
      ...initState.recipes.list[0],
      name: 'bar'
    };
    const expected = [
      addStarterRecipe(testRecipe),
      __internal_actions_for_testing_purposes_only__.update(testRecipe)
    ];

    let actual = getThunkActions(updateRecipe(testRecipe), getState);
    expect(actual.actions).toEqual(expected);
  });

  test('Sorting works', () => {

    const list = [
      { ...testRecipeBase, id: 2, name: 'a' },
      { ...testRecipeBase, id: 4, name: 'f' },
      { ...testRecipeBase, id: 3, name: 'x' },
      { ...testRecipeBase, id: 1, name: 'z' }
    ];

    let initState: RecipesState = {
      sortByID: false,
      sortDescending: false,
      id: 2,
      list,
      map: list.reduce((acc: {[index: number]: Recipe}, recipe) => {
        acc[recipe.id] = recipe;
        return acc;
      }, {})
    };

    let expected = {
      ...initState,
      sortByID: true,
      list: [...initState.list].sort((a, b) => a.id - b.id)
    };

    let actual = reducer(initState, sortRecipes(true, false));
    expect(actual).toEqual(expected);

    expected.sortDescending = true;
    expected.list.sort((a, b) => b.id - a.id);

    actual = reducer(actual, sortRecipes(true, true));
    expect(actual).toEqual(expected);

    expected.sortByID = false;
    expected.list.sort((a, b) => a.name < b.name ? 1 : (a.name > b.name ? -1 : 0));

    actual = reducer(actual, sortRecipes(false, true));
    expect(actual).toEqual(expected);

    expected.sortDescending = false;
    expected.list.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));

    actual = reducer(actual, sortRecipes(false, false));
    expect(actual).toEqual(expected);
  })
});

const getThunkActions = (thunk: Function, getState: Function = () => {}): ThunkGroup => {
  const dispatch = jest.fn();
  thunk(dispatch, getState, null);
  return dispatch.mock.calls.reduce((group, call) => {
    const parameter = call[0];
    group['type' in parameter ? 'actions' : 'thunks'].push(parameter);
    return group;
  }, { thunks: [], actions: [], length: dispatch.mock.calls.length });
}

interface ThunkGroup {
  thunks: Function[];
  actions: Action<string>[];
  length: number;
}

type RecipesState = ReturnType<typeof reducer>;
