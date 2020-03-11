import { FormState } from "../";
import updateWeights from "./utils/updateWeights";
import sanitizeText from "./utils/sanitizeText";

function setPortionSize(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionSize = action.payload;
  if (recipe.portionSize) {
    recipe = updateWeights(recipe, -1, sanitizeText(recipe.portionSize) * sanitizeText(recipe.portionCount));
  }
  return state;
}

export default setPortionSize;
