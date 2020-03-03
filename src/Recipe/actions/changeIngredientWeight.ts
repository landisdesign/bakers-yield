import { FormState } from "../Form";

function changeIngredientWeight(state: FormState, action: { payload: { row: number; weight: string; } }) {
  return state;
}

export default changeIngredientWeight;
