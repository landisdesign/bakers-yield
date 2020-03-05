import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";
import sanitizeNumber from "./utils/sanitizeNumber";

function setIngredientWeight(state: FormState, action: { payload: { row: number; weight: string; } }) {
  const {
    weight,
    row
  } = action.payload;
  state.recipe = updateWeights(state.recipe, row, sanitizeNumber(weight));
  return state;
}

export default setIngredientWeight;
