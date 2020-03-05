import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";
import sanitizeNumber from "./utils/sanitizeNumber";

function setPortionSize(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionSize = sanitizeNumber(action.payload);
  if (recipe.portionSize) {
    recipe = updateWeights(recipe, -1, recipe.portionSize * recipe.portionCount);
  }
  return state;
}

export default setPortionSize;
