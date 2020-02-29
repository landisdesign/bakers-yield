import { ApplicationState, Recipe, Ingredient } from "../../state";
import createListAndMap from "../../utils/createListAndMap";
import { prepare, reducer } from "../addRecipe";

const createState = (): ApplicationState => ({
  id: 5,
  ingredients: createListAndMap([
    {
      id: 2,
      name: 'default ingredient'
    },
    {
      id: 3,
      name: 'standard ingredient',
      recipeCount: 1
    },
    {
      id: 4,
      name: 'Starter ingredient',
      starterRecipeID: 6,
      recipeCount: 0
    }
  ]),
  recipes: createListAndMap([])
});

const createRecipe = (name: string, ingredientIDs: (string | number)[], isStarter: boolean = false): Omit<Recipe, 'id'> => ({
  name,
  isStarter,
  ingredients: ingredientIDs.map(id => ({
    ingredientID: id,
    percentage: 0,
    proportion: 0,
    weight: 0
  })),
  totalProportion: 0,
  totalWeight: 0,
  portionSize: 0,
  portionCount: 0,
  measureByPortion: false
});

test('Action payload properly populated', () => {
  const expected = { payload: createRecipe('foo', [1, 2, 3]) };
  const actual = prepare(expected.payload);
  expect(actual).toEqual(expected);
});

test('Standard recipe added and ingredients updated', () => {

  const initialState = createState();
  const recipeData = createRecipe('foo', [2, 3, 4, 'bar']);
  const testAction = {
    type: 'foo', // irrelevant, since reducer is getting it
    ...prepare(recipeData)
  };

  const expectedRecipe = {
    ...createRecipe('foo', [2, 3, 4, 6]),
    id: 5
  };

  const newIngredient: Ingredient = {
    id: 6,
    name: 'bar',
    recipeCount: 1
  };
  let expectedIngredients = initialState.ingredients.list.map(x => 'recipeCount' in x ? { ...x, recipeCount: x.recipeCount! + 1} : x);
  expectedIngredients.unshift(newIngredient);

  let expected = {
    id: 7,
    recipes: createListAndMap([expectedRecipe]),
    ingredients: createListAndMap(expectedIngredients)
  };

  const actual = reducer(testAction, initialState);
  expect(actual).toEqual(expected);
});

test('Starter recipe added and ingredients updated', () => {

  const initialState = createState();
  const recipeData = createRecipe('foo', [2, 3, 4, 'bar'], true);
  const testAction = {
    type: 'foo', // irrelevant, since reducer is getting it
    ...prepare(recipeData)
  };

  const expectedRecipe = {
    ...createRecipe('foo', [2, 3, 4, 6]),
    id: 5
  };

  const newIngredient: Ingredient = {
    id: 7,
    name: 'bar',
    recipeCount: 1
  };
  const newStarter: Ingredient = {
    id: 6,
    name: 'foo',
    recipeCount: 0,
    starterRecipeID: 5
  };
  let expectedIngredients = initialState.ingredients.list.map(x => 'recipeCount' in x ? { ...x, recipeCount: x.recipeCount! + 1} : { ...x });
  expectedIngredients.unshift(newIngredient, newStarter);

  let expected = {
    id: 8,
    recipes: createListAndMap([expectedRecipe]),
    ingredients: createListAndMap(expectedIngredients)
  };

  const actual = reducer(testAction, initialState);
  expect(actual).toEqual(expected);
});
