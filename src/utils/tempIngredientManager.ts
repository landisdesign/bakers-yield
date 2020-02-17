import { Ingredient, Recipe } from "../reducers/state";

function create(recipe: Recipe): Ingredient;
function create(name: string): Ingredient;
function create(nameOrRecipe: string | Recipe): Ingredient {
  const id = tempID;
  tempID--;
  if (typeof nameOrRecipe === 'string') {
    return {
      name: nameOrRecipe,
      id
    };
  }
  return {
    name: nameOrRecipe.name,
    id,
    starterRecipeID: nameOrRecipe.id
  };
}

const isTemp = (ingredient: Ingredient) => ingredient.id < 0;

export default {
  create,
  isTemp
};

export const createTempIngredient = create;
export const isTempIngredient = isTemp;

let tempID = -1;
