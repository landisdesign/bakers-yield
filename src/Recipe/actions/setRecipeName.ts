import { FormState } from "../";

function setRecipeName(state: FormState, action: { payload: string } ){
  state.recipe.name = action.payload;
  return state;
}

export default setRecipeName;
