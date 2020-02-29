import { Ingredient, Recipe, ApplicationState } from "../../state";
import createListAndMap from "../../utils/createListAndMap";

import { prepare, reducer } from '../removeRecipe';
import { updateIngredientID } from "../../../Recipe/formReducerConfig";

const createDefaultIngredients = (): Ingredient[] => [
  {
    id: 1,
    name: 'default'
  },
  {
    id: 3,
    name: 'standard only used here',
    recipeCount: 1
  },
  {
    id: 5,
    name: 'standard used elsewhere',
    recipeCount: 3
  },
  {
    id: 7,
    name: 'starter ingredient for this recipe',
    recipeCount: 1,
    starterRecipeID: 6
  }
];

const createRecipe = (isStarter: boolean = false, ingredients: Ingredient[] = createDefaultIngredients()): Recipe => ({
  name: 'foo',
  id: 6,
  portionSize: 0,
  portionCount: 0,
  totalWeight: 0,
  totalProportion: 0,
  isStarter,
  measureByPortion: false,
  ingredients: ingredients.map(ingredient => ({
    ingredientID: ingredient.id,
    weight: 0,
    proportion: 0,
    percentage: 0
  }))
});

const createState = (ingredients: Ingredient[] = createDefaultIngredients(), recipe: Recipe = createRecipe(false, ingredients)): ApplicationState => ({
  id: Math.max(recipe.id, ingredients.reduce((max, ingredient) => Math.max(max, ingredient.id), 0)),
  ingredients: createListAndMap(ingredients),
  recipes: createListAndMap([recipe])
});

test('Remove payload includes recipe ID', () => {
  const testRecipe = createRecipe();
  const expected = testRecipe.id;
  const { payload: actual } = prepare(testRecipe);
  expect(actual).toEqual(expected);
});

test('Standard recipe removed and ingredients updated', () => {
  const testRecipe = createRecipe();
  const initialState = createState();
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

  const actual = reducer(testAction, initialState);
  expect(actual).toEqual(expected);
});

test("Starter recipe removed and ingredients updated, with used starter's starterRecipeID removed", () => {
  const testIngredients = createDefaultIngredients();
  const testRecipe = createRecipe(true, testIngredients.filter(ingredient => !('starterRecipeID' in ingredient)));
  const initialState = createState(testIngredients, testRecipe);
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

  const actual = reducer(testAction, initialState);
  expect(actual).toEqual(expected);
});

test('Starter recipe removed and ingredients updated, with unused starter removed', () => {
  const testIngredients = createDefaultIngredients().map(ingredient => ingredient.starterRecipeID ? {...ingredient, recipeCount: 0} : ingredient);
  const testRecipe = createRecipe(true, testIngredients.filter(ingredient => !('starterRecipeID' in ingredient)));
  const initialState = createState(testIngredients, testRecipe);
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

  const actual = reducer(testAction, initialState);
  expect(actual).toEqual(expected);
});
