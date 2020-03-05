import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";

function setPortionCount(state: FormState, action: { payload: string }) {
  let recipe = state.recipe;
  recipe.portionCount = action.payload ? +action.payload : 0;
  recipe = updateWeights(recipe, -1, recipe.portionCount * recipe.portionSize);
  return state;
}

export default setPortionCount;
