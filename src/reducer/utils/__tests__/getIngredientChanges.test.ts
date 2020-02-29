import { Recipe } from "../../state";
import { MergeList } from "../../../utils/types";
import getIngredientChanges from '../getIngredientChanges';

const testRecipe = (ids: (string | number)[]): Recipe => ({
  name: 'foo',
  id: 1,
  isStarter: false,
  totalProportion: 0,
  totalWeight: 0,
  measureByPortion: false,
  portionCount: 0,
  portionSize: 0,
  ingredients: ids.map((id) => ({
    ingredientID: id,
    proportion: 0,
    weight: 0,
    percentage: 0
  }))
});

test('New ingredients are added to merge list', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const newRecipe = testRecipe([1, 2, 3, 4, 'a']);
  const expected: MergeList = {
    add: [],
    remove: [],
    new: ['a']
  };
  const actual = getIngredientChanges(oldRecipe, newRecipe);
  expect(actual).toEqual(expected);
});

test('Existing ingredients are added to merge list', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const newRecipe = testRecipe([1, 2, 3, 4, 5]);
  const expected: MergeList = {
    add: [5],
    remove: [],
    new: []
  };
  const actual = getIngredientChanges(oldRecipe, newRecipe);
  expect(actual).toEqual(expected);
});

test('Ingredients are removed from merge list', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const newRecipe = testRecipe([1, 3, 4]);
  const expected: MergeList = {
    add: [],
    remove: [2],
    new: []
  };
  const actual = getIngredientChanges(oldRecipe, newRecipe);
  expect(actual).toEqual(expected);
});

test('All options are populated correctly', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const newRecipe = testRecipe([1, 2, 4, 'a', 5]);
  const expected: MergeList = {
    add: [5],
    remove: [3],
    new: ['a']
  };
  const actual = getIngredientChanges(oldRecipe, newRecipe);
  expect(actual).toEqual(expected);
});

test('No ingredient changes registered on recipe with rearranged ingredients', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const newRecipe = testRecipe([2, 3, 1, 4]);
  const expected: MergeList = {
    add: [],
    remove: [],
    new: []
  };
  const actual = getIngredientChanges(oldRecipe, newRecipe);
  expect(actual).toEqual(expected);
});

test('Ingredients added on new recipe', () => {
  const newRecipe = testRecipe([1, 2, 4, 'a', 5]);
  const expected: MergeList = {
    add: [1, 2, 4, 5],
    remove: [],
    new: ['a']
  };
  const actual = getIngredientChanges(undefined, newRecipe);
  expect(actual).toEqual(expected);
});

test('Ingredients removed on old recipe', () => {
  const oldRecipe = testRecipe([1, 2, 3, 4]);
  const expected: MergeList = {
    add: [],
    remove: [1, 2, 3, 4],
    new: []
  };
  const actual = getIngredientChanges(oldRecipe);
  expect(actual).toEqual(expected);
});
