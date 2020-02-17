import reducer, { addStarterRecipe, removeStarterRecipe, updateStarterRecipe, updateRecipeIngredients, mergeIngredients, IngredientsState, MergeList } from '../ingredientsSlice';
import { Ingredient, Recipe } from '../state';

const testRecipe = {
  name: 'Foo',
  id: 5,
  ingredients: [],
  totalProportion: 0,
  totalWeight: 0,
  portionCount: 0,
  portionSize: 0,
  isStarter: true,
  measureByPortion: false
};

const buildState = (list: Ingredient[]): IngredientsState => ({
  id: list.length,
  map: list.reduce((ids, ingredient) => {
    ids[ingredient.id] = ingredient;
    return ids;
  }, {} as {[index: number]: Ingredient}),
  tempMap: {},
  list: list.map(x => ({...x}))
});

describe('action creators return proper content', () => {

  test('addStarterRecipe', () => {

    const expected = {
      type: addStarterRecipe.toString(),
      payload: {
        name: testRecipe.name,
        starterRecipeID: testRecipe.id
      }
    };

    const actual = addStarterRecipe(testRecipe);
    expect(actual).toEqual(expected);
  })

  test('removeStarterRecipe', () => {

    const expected = {
      type: removeStarterRecipe.toString(),
      payload: testRecipe.id
    };

    const actual = removeStarterRecipe(testRecipe);
    expect(actual).toEqual(expected);
  })

  test('updateStarterRecipe', () => {

    const expected = {
      type: updateStarterRecipe.toString(),
      payload: {
        id: testRecipe.id,
        name: testRecipe.name
      },
    };

    const actual = updateStarterRecipe(testRecipe);
    expect(actual).toEqual(expected);
  })

  test('mergeIngredients', () => {

    const testMerge: MergeList = {
      add: [
        {
          name: 'foo',
          id: 1
        },
        {
          name: 'bar',
          id: -1
        },
        {
          name: 'baz',
          id: 1,
          starterRecipeID: 5
        }
      ],
      remove: [
        {
          name: 'a',
          id: 4
        },
        {
          name: 'b',
          id: 6
        },
        {
          name: 'bc',
          id: 8,
          starterRecipeID: 6
        }
      ]
    };

    const expected ={
      type: mergeIngredients.toString(),
      payload: testMerge
    };

    const actual = mergeIngredients(testMerge);
    expect(actual).toEqual(expected);
  })
})

const initialState = (): IngredientsState => buildState([ {  name: 'a', recipeCount: 1, id: 1 } ]);

describe('addStarterRecipe state', () => {

  test('New recipe creates ingredient', () => {

    const init = initialState();
    const expected = buildState([
      ...init.list,
      {
        name: testRecipe.name,
        starterRecipeID: testRecipe.id,
        recipeCount: 0,
        id: init.id + 1
      }
    ])

    const testAction = addStarterRecipe(testRecipe);

    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Existing recipe updates ingredient with name and id', () => {

    const init = initialState();
    const testState = buildState([
      ...init.list,
      {
        name: testRecipe.name,
        recipeCount: 4,
        id: init.id + 1
      }
    ]);

    const testAction = addStarterRecipe(testRecipe);

    let expected = buildState(testState.list.map(x => x.name === testRecipe.name ? {...x, starterRecipeID: testRecipe.id} : x));

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })
});

describe('removeStarterRecipe state', () => {

  test('Used recipe removes id', () => {

    const init = initialState();
    const testState = buildState([
      ...init.list,
      {
        name: testRecipe.name,
        recipeCount: 4,
        id: init.id + 1,
        starterRecipeID: testRecipe.id
      }
    ]);

    const testAction = removeStarterRecipe(testRecipe);

    let expected = buildState(testState.list.map(x => x.name === testRecipe.name ? { name: x.name, recipeCount: x.recipeCount, id: x.id } : x));

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })

  test('Unused recipe removes entire ingredient', () => {

    const init = initialState();
    const testState = buildState([
      ...init.list,
      {
        name: testRecipe.name,
        recipeCount: 0,
        id: init.id + 1,
        starterRecipeID: testRecipe.id
      }
    ]);

    const testAction = removeStarterRecipe(testRecipe);

    let expected = buildState(testState.list.filter(x => x.name !== testRecipe.name));
    expected.id++; // needs to match original state ID

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })
});

describe('updateStarterRecipe state', () => {

  test('Existing recipe updates ingredient with new name', () => {

    const init = initialState();
    const testState = buildState([
      ...init.list,
      {
        name: testRecipe.name,
        recipeCount: 4,
        id: init.id + 1,
        starterRecipeID: testRecipe.id
      }
    ]);

    const updatedRecipe = {
      ...testRecipe,
      name: 'baz'
    };

    const testAction = updateStarterRecipe(updatedRecipe);

    let expected = buildState(testState.list.map(x => x.starterRecipeID === testRecipe.id ? {...x, name: updatedRecipe.name} : x));

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })
});

describe('updateIngredients', () => {

  const initialState = ():IngredientsState => {
    let initState = buildState([
      {
        id: 1,
        name: 'a'
      },
      {
        id: 2,
        name: 'b'
      },
      {
        id: 3,
        name: 'c'
      },
    ]);
    initState.tempMap = {
      [-1]: 3
    };
    return initState;
  };

  const testRecipe = (real: boolean):Recipe => ({
    name: 'foo',
    id: 5,
    ingredients: [
      {
        ingredientID: real ? 3 : -1,
        weight: 0,
        percentage: 0,
        proportion: 0
      }
    ],
    portionCount: 0,
    portionSize: 0,
    totalWeight: 0,
    totalProportion: 0,
    isStarter: false,
    measureByPortion: false
  });

  test('Updating a recipe with no new ingredients changes nothing', () => {
    const state = initialState();
    const test = testRecipe(true);
    const expected = testRecipe(true);

    const testAction = updateRecipeIngredients(test);
    reducer(state, testAction);
    expect(test).toEqual(expected);
  });

  test('Updating a recipe with new ingredients updates new ingredients', () => {
    const state = initialState();
    const expectedState = initialState();
    expectedState.tempMap = {};

    const test = testRecipe(false);
    const expectedRecipe = testRecipe(true);

    const testAction = updateRecipeIngredients(test);
    const actual = reducer(state, testAction);
    expect(actual).toEqual(expectedState);
    expect(test).toEqual(expectedRecipe);
  });
});

describe('mergeIngredients state', () => {

  // more detailed than default
  const initialState = ():IngredientsState => buildState([
    { // default ingredient; should not be removed
      name: 'a',
      id: 1
    },
    { // ingredient only used here; eligible for removal
      name: 'b',
      recipeCount: 1,
      id: 2
    },
    { // ingredient used elsewhere; should not be removed
      name: 'c',
      recipeCount: 3,
      id: 3
    },
    { // ingredient only used here; eligible for removal
      name: 'd',
      recipeCount: 1,
      id: 4
    },
    { // starter recipe only used here; should not be removed
      name: testRecipe.name,
      recipeCount: 1,
      starterRecipeID: testRecipe.id,
      id: 5
    }
  ]);

  const addedIngredients = [
    {
      name: 'aa',
      id: -1
    },
    {
      name: 'Bb',
      id: -2
    },
    {
      name: 'foo',
      id: -3
    },
  ];
  const removedIngredients = [
    { // ingredient only used here; eligible for removal
      name: 'b',
      recipeCount: 1,
      id: 2
    },
    { // ingredient only used here; eligible for removal
      name: 'd',
      recipeCount: 1,
      id: 4
    }
  ]; // both will be removed
  const mergedIngredients: MergeList = {
    add: addedIngredients,
    remove: removedIngredients
  };

  const sortNames = (a: Ingredient, b: Ingredient) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
  }

  test('Just adding ingredients, returns sorted', () => {
    const init = initialState();
    const newIngredients = addedIngredients.map((ingredient, i) => ({name: ingredient.name, recipeCount: 1, id: init.id + 1 + i}));
    const tempMap = addedIngredients.reduce((map, ingredient, i) => {
      map[ingredient.id] = newIngredients[i].id;
      return map;
    }, {} as {[index: number]: number});

    const expected = {
      ...buildState([...init.list, ...newIngredients].sort(sortNames)),
      tempMap
    };

    const testAction = mergeIngredients({add: addedIngredients});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Just removing ingredients', () => {
    // a little squirelly to handle trimming
    const init = initialState();
    let expected = buildState([...init.list.filter(ingredient => !removedIngredients.some(removedIngredient => removedIngredient.id === ingredient.id))]);
    expected.id = init.id;

    const testAction = mergeIngredients({remove: removedIngredients});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Adding and removing ingredients, added ingredients sorted', () => {
    const init = initialState();
    const newIngredients = addedIngredients.map((ingredient, i) => ({name: ingredient.name, recipeCount: 1, id: init.id + 1 + i}));
    const tempMap = addedIngredients.reduce((map, ingredient, i) => {
      map[ingredient.id] = newIngredients[i].id;
      return map;
    }, {} as {[index: number]: number});

    const expected = {
      ...buildState([...init.list, ...newIngredients]
        .filter(ingredient => !removedIngredients.some(removedIngredient => removedIngredient.id === ingredient.id))
        .sort(sortNames)),
      id: init.id + addedIngredients.length,
      tempMap
    };

    const testAction = mergeIngredients(mergedIngredients);
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Adding a preexisting ingredient increments its recipeCount', () => {
    const init = initialState();
    const addedIngredient = init.list[1];
    const list = init.list.map(ingredient => ingredient == addedIngredient ? {...ingredient, recipeCount: ingredient.recipeCount! + 1} : ingredient);

    const expected = {
      ...init,
      list
    };

    const testAction = mergeIngredients({add: [addedIngredient]});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Adding a preexisting default ingredient does nothing', () => {
    const addedIngredient = initialState().list[0];

    const expected = initialState();

    const testAction = mergeIngredients({add: [addedIngredient]});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Removing an ingredient used elsewhere decrements its usage count', () => {
    const init = initialState();
    const remove = [{...init.list[2]}];
    const expected = buildState(init.list.map(ingredient => remove.some(doomedIngredient => doomedIngredient.id === ingredient.id)
      ? {...ingredient, recipeCount: ingredient.recipeCount! - 1}
      : ingredient));

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })


  test('Attempting to remove a starter recipe only used here fails', () => {
    const init = initialState();
    const remove = init.list.filter(ingredient => ingredient.starterRecipeID === testRecipe.id);
    const expected = buildState(init.list.map(ingredient => remove.some(doomedIngredient => doomedIngredient.id === ingredient.id)
    ? {...ingredient, recipeCount: ingredient.recipeCount! - 1}
    : ingredient));

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Attempting to remove a default ingredient fails', () => {
    const remove = [initialState().list[0]];
    const expected = initialState();

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })
});
