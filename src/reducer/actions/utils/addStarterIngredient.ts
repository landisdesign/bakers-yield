import { Ingredient, Recipe } from "../../state";
import createIngredient from "./createIngredient";

const addStarterIngredient = (ingredients: Ingredient[], nextID: number, recipe: Recipe): [Ingredient[], number] => {

  const existingIngredient = ingredients.find(ingredient => ingredient.name.toLowerCase() === recipe.name.toLowerCase());

  if (existingIngredient) {
    existingIngredient.starterRecipeID = recipe.id;
    existingIngredient.name = recipe.name;
    return [ingredients, nextID];
  }

  createIngredient.init(nextID);
  const newIngredient = createIngredient(recipe.name, recipe.id);
  const newNextID = createIngredient.complete();
  ingredients.push(newIngredient);
  return [ingredients, newNextID];
};

export default addStarterIngredient;
