import reducer, { addRecipe, removeRecipe, updateRecipe, sortRecipes, __internal_actions_for_testing_purposes_only__ } from '../recipesSlice';
import { Recipe } from '../state';

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

  const testRecipe = {
    isStarter: false,
    measureByPortion: false,
    portionSize: 0,
    portionCount: 0,
    totalWeight: 0,
    totalProportion: 0,
    ingredients: []
  };

  const initialState = (): RecipesState => {
    const list: Recipe[] = (new Array(5)).fill(null).map((_, i) => ({
      ...testRecipe,
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
      ...testRecipe,
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
    fail();
  });

  test('Updating a recipe', () => {
    fail();
  });
});

describe('Public actions update state properly', () => {

  test('Adding standard recipe updates properly', () => {
    fail();
  });

  test('Adding starter recipe updates recipes and ingredients', () => {
    fail();
  });

  test('Removing standard recipe updates properly', () => {
    fail();
  });

  test('Removing starter recipe updates recipes and ingredients', () => {
    fail();
  });

  test('Updating standard recipe updates properly', () => {
    fail();
  });

  test('Changing from standard to starter recipe and vice versa updates recipes and ingredients', () => {
    fail();
  });

  test('Changing the name of a starter recipe updates recipes and ingredients', () => {
    fail();
  });
});

type RecipesState = ReturnType<typeof reducer>;
