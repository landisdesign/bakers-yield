import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";

function setPortionSize(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionSize = action.payload ? +action.payload : 0;
  if (recipe.portionSize) {
    recipe = updateWeights(recipe, -1, recipe.portionSize * recipe.portionCount);
  }
  return state;
}

export default setPortionSize;
