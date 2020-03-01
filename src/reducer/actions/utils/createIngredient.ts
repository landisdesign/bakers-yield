import { Ingredient } from '../../state';

let nextID = 0;

const createIngredient = (name: string, starterRecipeID?: number): Ingredient => {
  if (nextID < 1) {
    throw new Error('createIngredient must be initialized before use');
  }
  return {
    name,
    id: nextID++,
    recipeCount: 0,
    ...(typeof starterRecipeID === 'number' && { starterRecipeID })
  };
};

createIngredient.init = (id: number) => {
  nextID = id;
}

createIngredient.complete = () => {
  const endID = nextID;
  nextID = -1;
  return endID;
};

export default createIngredient;
