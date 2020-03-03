import { FormState } from "../Form";

function changeIngredient(state: FormState, action: { payload: { row: number; name: string; } }) {
  return state;
}

export default changeIngredient;
