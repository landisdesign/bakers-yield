import { FormState } from "../Form";

function setStarterRecipe(state: FormState, action: { payload: boolean }) {
  state.recipe.isStarter = action.payload;
  return state;
}

export default setStarterRecipe;
