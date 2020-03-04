import { FormState } from "../Form";
import updateWeights from "./utils/updateWeights";

function setPortionSize(state: FormState, action: { payload: number }) {
  let recipe = state.recipe;
  recipe.portionSize = action.payload;
  recipe = updateWeights(recipe, -1, recipe.portionSize * recipe.portionCount);
  return state;
}

export default setPortionSize;
