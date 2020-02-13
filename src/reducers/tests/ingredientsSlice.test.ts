import reducer, { addStarterRecipe, removeStarterRecipe, mergeIngredients } from '../ingredientsSlice';
import { Ingredient } from '../state';

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
      payload: testRecipe.name
    };

    const actual = removeStarterRecipe(testRecipe);
    expect(actual).toEqual(expected);
  })

  test('mergeIngredients', () => {

    const testMerge = {
      add: ['a', 'b', 'c'],
      remove: ['x', 'y', 'z']
    };

    const expected ={
      type: mergeIngredients.toString(),
      payload: testMerge
    };

    const actual = mergeIngredients(testMerge);
    expect(actual).toEqual(expected);
  })
})

const initialState = () => [ {  name: 'a', recipeCount: 1 } ];

describe('addStarterRecipe state', () => {

  test('New recipe creates ingredient', () => {

    const expected = [
      ...initialState(),
      {
        name: testRecipe.name,
        starterRecipeID: testRecipe.id,
        recipeCount: 0
      }
    ];

    const testAction = addStarterRecipe(testRecipe);

    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Existing recipe updates ingredient with name and id', () => {

    const testState = [
      ...initialState(),
      {
        name: testRecipe.name,
        recipeCount: 4
      }
    ];

    const testAction = addStarterRecipe(testRecipe);

    let expected = testState.map(x => x.name === testRecipe.name ? {...x, starterRecipeID: testRecipe.id} : x);

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })
});

describe('removeStarterRecipe state', () => {

  test('Used recipe removes id', () => {

    const testState = [
      ...initialState(),
      {
        name: testRecipe.name,
        recipeCount: 4,
        starterRecipeID: testRecipe.id
      }
    ];

    const testAction = removeStarterRecipe(testRecipe);

    let expected = testState.map(x => x.name === testRecipe.name ? { name: x.name, recipeCount: x.recipeCount } : x);

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })

  test('Unused recipe removes entire ingredient', () => {

    const testState = [
      ...initialState(),
      {
        name: testRecipe.name,
        recipeCount: 0,
        starterRecipeID: testRecipe.id
      }
    ];

    const testAction = removeStarterRecipe(testRecipe);

    let expected = testState.filter(x => x.name !== testRecipe.name);

    const actual = reducer(testState, testAction);
    expect(actual).toEqual(expected);
  })
});

describe('mergeIngredients state', () => {

  // more detailed than default
  const initialState = ():Ingredient[] => [
    { // default ingredient; should not be removed
      name: 'a'
    },
    { // ingredient only used here; eligible for removal
      name: 'b',
      recipeCount: 1
    },
    { // ingredient used elsewhere; should not be removed
      name: 'c',
      recipeCount: 3
    },
    { // ingredient only used here; eligible for removal
      name: 'd',
      recipeCount: 1
    },
    { // starter recipe only used here; should not be removed
      name: testRecipe.name,
      recipeCount: 1,
      starterRecipeID: testRecipe.id
    }
  ];

  const addedIngredients = ['aa', ' bb ', 'z'];
  const removedIngredients = ['b', ' d ']; // both will be removed
  const mergedIngredients = {
    add: addedIngredients,
    remove: removedIngredients
  };

  const sortNames = (a: Ingredient, b: Ingredient) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
  }

  test('Just adding ingredients, returns sorted', () => {
    const expected = [...initialState(), ...addedIngredients.map(name => ({name: name.trim(), recipeCount: 1}))].sort(sortNames);

    const testAction = mergeIngredients({add: addedIngredients});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Just removing ingredients', () => {
    // a little squirelly to handle trimming
    const expected = initialState().filter(ingredient => !removedIngredients.some(name => name.trim() === ingredient.name));

    const testAction = mergeIngredients({remove: removedIngredients});
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Adding and removing ingredients, added ingredients sorted', () => {
    const expected = [...initialState(), ...addedIngredients.map(name => ({name: name.trim(), recipeCount: 1}))]
      .filter(ingredient => !removedIngredients.some(name => name.trim() === ingredient.name))
      .sort(sortNames)
    ;

    const testAction = mergeIngredients(mergedIngredients);
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Removing an ingredient used elsewhere decrements its usage count', () => {
    const remove = ['c'];
    const expected = initialState().map(
      ingredient => remove.some(name => name === ingredient.name)
        ? {...ingredient, recipeCount: ingredient.recipeCount! - 1}
        : ingredient
    );

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Removing an ingredient only used here removes it', () => {
    const remove = ['b'];
    const expected = initialState().filter(ingredient => !remove.some(name => name === ingredient.name));

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Attempting to remove a starter recipe only used here fails', () => {
    const remove = [testRecipe.name];
    const expected = initialState().map(
      ingredient => remove.some(name => name === ingredient.name)
        ? {...ingredient, recipeCount: ingredient.recipeCount! - 1}
        : ingredient
    );

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })

  test('Attempting to remove a default ingredient fails', () => {
    const remove = ['a'];
    const expected = initialState();

    const testAction = mergeIngredients({ remove });
    const actual = reducer(initialState(), testAction);
    expect(actual).toEqual(expected);
  })
});
