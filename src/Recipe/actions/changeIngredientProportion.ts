import { FormState } from "../Form";

function changeIngredientProportion(state: FormState, action: { payload: { row: number; proportion: string; } }) {
  return state;
}

export default changeIngredientProportion;
