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

const register = (tempIngredient: Ingredient, realIngredient: Ingredient) => {
  idMap[tempIngredient.id] = realIngredient.id;
}

const getRealID = (tempIngredient: Ingredient) => {
  const realID = idMap[tempIngredient.id];
  delete idMap[tempIngredient.id];
  return realID;
}

const isTemp = (ingredient: Ingredient) => ingredient.id < 0;

export default {
  create,
  register,
  getRealID,
  isTemp
};

let tempID = -1;
let idMap : {[index: number]: number} = {};
