import { FormState } from "../Form";

function setMeasureByPortion(state: FormState, action: { payload: boolean }) {
  state.recipe.measureByPortion = action.payload;
  return state;
}

export default setMeasureByPortion;
