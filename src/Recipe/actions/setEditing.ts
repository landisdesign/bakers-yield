import { FormState } from "../";

function setEditing(state: FormState, action: { payload: boolean }) {
  state.edit = action.payload;
  return state;
}

export default setEditing;
