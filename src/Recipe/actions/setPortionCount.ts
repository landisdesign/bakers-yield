import { FormState } from "../";
import updateWeights from "./utils/updateWeights";
import textToNumber from "./utils/textToNumber";

function setPortionCount(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionCount = action.payload;
  recipe = updateWeights(recipe, -1, textToNumber(recipe.portionCount) * textToNumber(recipe.portionSize));
  return state;
}

export default setPortionCount;
