import { Ingredient, Recipe } from "../../../state";
import updateIngredients from "../updateIngredients";

const createRecipe = (ingredientIDs: (string | number)[] = [9, 10, 7]): Recipe => ({
  id: 1,
  name: 'foo',
  totalWeight: 0,
  totalProportion: 0,
  portionCount: 0,
  measureByPortion: false,
  isStarter: false,
  portionSize: 0,
  ingredients: ingredientIDs.map(id => ({
    ingredientID: id,
    percentage: 0,
    proportion: 0,
    weight: 0
  }))
});

const getID = (ingredients: Ingredient[] = defaultIngredients()): number =>
  ingredients.reduce((x, ingredient) => Math.max(x, ingredient.id as number), 0) + 1;

// case-insensitive alpha order by name
const defaultIngredients = (): Ingredient[] => [
  {
    id: 6,
    name: 'default ingredient'
  },
  {
    id: 10,
    name: 'singly used standard ingredient',
    recipeCount: 1
  },
  {
    id: 7,
    name: 'Singly used starter ingredient',
    starterRecipeID: 8,
    recipeCount: 0
  },
  {
    id: 9,
    name: 'used standard ingredient',
    recipeCount: 3
  },
  {
    id: 4,
    name: 'Used starter ingredient',
    starterRecipeID: 8,
    recipeCount: 3
  }
];

describe('Adding existing ingredients', () => {

  test('Updates recipeCount on standard and starter recipe ingredients', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [10, 4],
      new: [],
      remove: []
    };

    const expected = [
        testIngredients.map(x => updates.add.some(id => id === x.id) ? {
        ...x,
        recipeCount: x.recipeCount! + 1
      } : x),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });

  test('No change to default ingredients', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [6],
      new: [],
      remove: []
    };

    const expected = [
      testIngredients.map(x => ({...x})),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });
});

describe('Removing ingredients', () => {

  test('Updates recipeCount on standard and starter recipe ingredients', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [],
      new: [],
      remove: [9, 4]
    };

    const expected = [
      testIngredients.map(x => updates.remove.some(id => id === x.id) ? {
        ...x,
        recipeCount: x.recipeCount! - 1
      } : x),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });

  test('Standard ingredient removed on last recipeCount', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [],
      new: [],
      remove: [10]
    };

    const expected = [
      testIngredients.filter(x => updates.remove.some(id => id !== x.id)),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });

  test('Starter recipe ingredient stays, recipeCount set to zero', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [],
      new: [],
      remove: [7]
    };
    const expected = [
      testIngredients.map(x => updates.remove.some(id => id === x.id) ? {...x, recipeCount : 0} : {...x}),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });

  test('No change to default ingredients', () => {

    const testIngredients = defaultIngredients();
    const testID = getID();

    const updates = {
      add: [],
      new: [],
      remove: [6]
    };

    const expected = [
      testIngredients.map(x => ({...x})),
      testID
    ];

    const actual = updateIngredients(updates, testIngredients, testID);
    expect(actual).toEqual(expected);
  });
});

describe('Adding new ingredients', () => {

  test('New ingredients made with recipeCount of 1, recipe updated to link to ingredient, id updated', () => {

    const updates = {
      add: [],
      new: ['foo'],
      remove: []
    };

    const initialRecipe = createRecipe([6, 10, updates.new[0], 7]);

    const testIngredients = defaultIngredients();
    const testID = getID();

    const newIngredient = {
      id: testID,
      name: updates.new[0],
      recipeCount: 1
    }

    const newRecipe = createRecipe([6, 10, newIngredient.id, 7]);
    const newIngredientsList = [...testIngredients, newIngredient];

    const expected = [newIngredientsList, newIngredient.id + 1, newRecipe];

    const actual = updateIngredients(updates, testIngredients, testID, initialRecipe);
    expect(actual).toEqual(expected);
  });
});

