import manager from '../tempIngredientManager';
import { Ingredient, Recipe } from '../../reducers/state';

test('Passing a name returns a full Ingredient', () => {

  const expected: Ingredient = {
    id: -1,
    name: 'foo'
  };

  const actual = manager.create(expected.name);

  expect (actual).toEqual(expected);
});

test('Passing a starter recipe returns an Ingredient with the recipe ID as the starterRecipeID', () => {

  const testRecipe: Recipe = {
    name: 'bar',
    id: 5,
    ingredients: [],
    portionCount: 0,
    portionSize: 0,
    totalProportion: 0,
    totalWeight: 0,
    isStarter: true,
    measureByPortion: false
  };

  const expected: Ingredient = {
    id: -2,
    name: testRecipe.name,
    starterRecipeID: testRecipe.id
  };

  const actual = manager.create(testRecipe);

  expect(actual).toEqual(expected);
});

test('Succeeding ingredients receive different IDs', () => {

  const expected1: Ingredient = {
    name: 'baz',
    id: -3
  };

  const actual1 = manager.create(expected1.name);
  expect(actual1).toEqual(expected1);

  const expected2: Ingredient = {
    name: 'qux',
    id: -4
  };

  const actual2 = manager.create(expected2.name);
  expect(actual2).toEqual(expected2);
});

test('Ingredients registered with manager can retrieve real IDs once', () => {

  const fakeIngredient = manager.create('quz');
  const realIngredient = {
    ...fakeIngredient,
    id: 5
  };

  manager.register(fakeIngredient, realIngredient);

  const actual = manager.getRealID(fakeIngredient);
  expect(actual).toEqual(realIngredient.id);

  const undefinedActual = manager.getRealID(fakeIngredient);
  expect(undefinedActual).toBeUndefined();
});
