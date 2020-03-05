import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";
import sanitizeNumber from "./utils/sanitizeNumber";

function setTotalWeight(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe = updateWeights(recipe, -1, sanitizeNumber(action.payload));
  return state;
}

export default setTotalWeight;
