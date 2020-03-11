import { FormState } from "../";

function addIngredient(state: FormState) {
  state.recipe.ingredients.push({
    ingredientID: '',
    weight: '',
    proportion: '',
    percentage: 0
  });
  return state;
}

export default addIngredient;
