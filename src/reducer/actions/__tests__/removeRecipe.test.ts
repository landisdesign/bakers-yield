import { Ingredient, Recipe } from "../../state";
import createListAndMap from "../utils/createListAndMap";

import { prepare, reducer } from '../removeRecipe';
import createTestIngredients from "../../../utils/testing/createTestIngredients";
import createTestRecipe from "../../../utils/testing/createTestRecipe";
import createTestState from "../../../utils/testing/createTestReduxState";

test('Remove payload includes recipe ID', () => {
  const testRecipe = createTestRecipe();
  const expected = testRecipe.id;
  const { payload: actual } = prepare(testRecipe);
  expect(actual).toEqual(expected);
});

test('Standard recipe removed and ingredients updated', () => {
  const testRecipe = createTestRecipe();
  const initialState = createTestState();
  const expected = {
    id: initialState.id,
    recipes: createListAndMap([] as Recipe[]),
    ingredients: createListAndMap(initialState.ingredients.list.reduce((list, ingredient) => {
      if (ingredient.recipeCount === 1 && !ingredient.starterRecipeID) {
        return list;
      }
      let newIngredient = {...ingredient};
      if (newIngredient.recipeCount) {
        newIngredient.recipeCount--;
      }
      list.push(newIngredient);
      return list;
    }, [] as Ingredient[]))
  };
  const testAction = prepare(testRecipe);

  const actual = reducer(initialState, testAction);
  expect(actual).toEqual(expected);
});

test("Starter recipe removed and ingredients updated, with used starter's starterRecipeID removed", () => {
  const testIngredients = createTestIngredients();
  const testRecipe = createTestRecipe('foo', true, testIngredients.filter(ingredient => !('starterRecipeID' in ingredient)));
  const initialState = createTestState(testIngredients, [testRecipe]);
  const expected = {
    id: initialState.id,
    recipes: createListAndMap([] as Recipe[]),
    ingredients: createListAndMap(initialState.ingredients.list.reduce((list, ingredient) => {
      if (ingredient.recipeCount === 1 && !ingredient.starterRecipeID) {
        return list;
      }
      let newIngredient = {...ingredient};
      if (newIngredient.starterRecipeID) {
        delete newIngredient.starterRecipeID;
      }
      else if (newIngredient.recipeCount) {
        newIngredient.recipeCount--;
      }
      list.push(newIngredient);
      return list;
    }, [] as Ingredient[]))
  };
  const testAction = prepare(testRecipe);

  const actual = reducer(initialState, testAction);
  expect(actual).toEqual(expected);
});

test('Starter recipe removed and ingredients updated, with unused starter removed', () => {
  const testIngredients = createTestIngredients().map(ingredient => ingredient.starterRecipeID ? {...ingredient, recipeCount: 0} : ingredient);
  const testRecipe = createTestRecipe('foo', true, testIngredients.filter(ingredient => !('starterRecipeID' in ingredient)));
  const initialState = createTestState(testIngredients, [testRecipe]);
  const expected = {
    id: initialState.id,
    recipes: createListAndMap([] as Recipe[]),
    ingredients: createListAndMap(initialState.ingredients.list.reduce((list, ingredient) => {
      if (ingredient.recipeCount === 1 || ingredient.starterRecipeID) {
        return list;
      }
      let newIngredient = {...ingredient};
      if (newIngredient.recipeCount) {
        newIngredient.recipeCount--;
      }
      list.push(newIngredient);
      return list;
    }, [] as Ingredient[]))
  };
  const testAction = prepare(testRecipe);

  const actual = reducer(initialState, testAction);
  expect(actual).toEqual(expected);
});
