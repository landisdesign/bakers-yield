import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";
import sanitizeNumber from "./utils/sanitizeNumber";

function setPortionCount(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionCount = sanitizeNumber(action.payload);
  recipe = updateWeights(recipe, -1, recipe.portionCount * recipe.portionSize);
  return state;
}

export default setPortionCount;
