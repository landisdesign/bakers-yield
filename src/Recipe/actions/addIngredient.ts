import { FormState } from "../Form";

function addIngredient(state: FormState) {
  state.recipe.ingredients.push({
    ingredientID: '',
    weight: 0,
    proportion: 0,
    percentage: 0
  });
  return state;
}

export default addIngredient;
