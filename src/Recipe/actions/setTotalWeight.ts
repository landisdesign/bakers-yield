import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";

function setTotalWeight(state: FormState, action: { payload: string }) {
  const sanitizedWeight = action.payload ? +action.payload : 0;
  let recipe = state.recipe;
  recipe = updateWeights(recipe, -1, sanitizedWeight);
  return state;
}

export default setTotalWeight;
