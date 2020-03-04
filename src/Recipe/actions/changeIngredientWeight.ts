import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";

function changeIngredientWeight(state: FormState, action: { payload: { row: number; weight: string; } }) {
  const {
    weight,
    row
  } = action.payload;
  const sanitizedWeight = weight ? +weight : 0;
  state.recipe = updateWeights(state.recipe, row, sanitizedWeight);
  return state;
}

export default changeIngredientWeight;
