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

export default {
  create,
  register,
  getRealID
};

let tempID = -1;
let idMap : {[index: number]: number} = {};
