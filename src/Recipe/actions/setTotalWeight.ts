import { FormState } from "../";
import updateWeights from "./utils/updateWeights";

function setTotalWeight(state: FormState, action: { payload: string }) {
  state.recipe = updateWeights(state.recipe, -1, action.payload);
  return state;
}

export default setTotalWeight;
