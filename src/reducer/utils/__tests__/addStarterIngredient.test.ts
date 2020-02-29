import { Recipe, Ingredient } from '../../state';
import addStarterIngredient from '../addStarterIngredient';

const createRecipe = (): Recipe => ({
  id: 5,
  name: 'foo',
  isStarter: true,
  measureByPortion: false,
  totalWeight: 0,
  totalProportion: 0,
  portionCount: 0,
  portionSize: 0,
  ingredients: []
});

test('Starter added as new ingredient', () => {

  const recipe = createRecipe();
  const initList: Ingredient[] = [];
  const initID = 10;
  const expected = [
    [
      {
        id: initID,
        name: recipe.name,
        recipeCount: 0,
        starterRecipeID: recipe.id
      }
    ],
    11
  ];

  const actual = addStarterIngredient(initList, initID, recipe);
  expect(actual).toEqual(expected);
});

test('Starter added to existing ingredient', () => {

  const recipe = createRecipe();
  const initList = [{
    id: 3,
    name: recipe.name,
    recipeCount: 2
  }];
  const initID = 10;
  const expected = [
    [
      {
        ...initList[0],
        starterRecipeID: recipe.id
      }
    ],
    10
  ];

  const actual = addStarterIngredient(initList, initID, recipe);
  expect(actual).toEqual(expected);
});

