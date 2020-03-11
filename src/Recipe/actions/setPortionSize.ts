import { FormState } from "../";
import updateWeights from "./utils/updateWeights";
import textToNumber from "./utils/textToNumber";

function setPortionSize(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionSize = action.payload;
  if (recipe.portionSize) {
    recipe = updateWeights(recipe, -1, textToNumber(recipe.portionSize) * textToNumber(recipe.portionCount));
  }
  return state;
}

export default setPortionSize;
