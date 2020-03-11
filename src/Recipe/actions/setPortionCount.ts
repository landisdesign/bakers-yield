import { FormState } from "../";
import updateWeights from "./utils/updateWeights";
import sanitizeText from "./utils/sanitizeText";

function setPortionCount(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionCount = action.payload;
  recipe = updateWeights(recipe, -1, sanitizeText(recipe.portionCount) * sanitizeText(recipe.portionSize));
  return state;
}

export default setPortionCount;
