import { Ingredient } from "../../state";

const createTestIngredients = (): Ingredient[] => [
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

export default createTestIngredients;
