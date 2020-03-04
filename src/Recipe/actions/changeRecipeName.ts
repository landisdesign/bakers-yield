import { FormState } from "../Form";

function changeRecipeName(state: FormState, action: { payload: string } ){
  state.recipe.name = action.payload;
  return state;
}

export default changeRecipeName;
