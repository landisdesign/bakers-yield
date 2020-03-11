import { FormState } from "../";
import updateWeights from "./utils/updateWeights";

function setIngredientWeight(state: FormState, action: { payload: { row: number; weight: string; } }) {
  const {
    weight,
    row
  } = action.payload;
  state.recipe = updateWeights(state.recipe, row, weight);
  return state;
}

export default setIngredientWeight;
