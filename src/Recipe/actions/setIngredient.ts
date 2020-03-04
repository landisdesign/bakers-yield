import { FormState } from "../Form";

function setIngredient(state: FormState, action: { payload: { row: number; name: string; } }) {
  const {
    row,
    name
  } = action.payload;
  const testName = name.trim().toLowerCase();
  const ingredientID = state.ingredientsMap[testName] || name.trim();
  state.recipe.ingredients[row].ingredientID = ingredientID;
  return state;
}

export default setIngredient;
