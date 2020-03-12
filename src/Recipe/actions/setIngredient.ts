import { FormState } from "../";

function setIngredient(state: FormState, action: { payload: { row: number; name: string; } }) {
  const {
    row,
    name
  } = action.payload;
  const ingredientID = state.ingredientsMap[name.toLowerCase()] || name;
  state.recipe.ingredients[row].ingredientID = ingredientID;
  return state;
}

export default setIngredient;
