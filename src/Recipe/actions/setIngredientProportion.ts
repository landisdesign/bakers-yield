import { FormState } from "../";
import updateWeights from "./utils/updateWeights";
import textToNumber from "./utils/textToNumber";

function setIngredientProportion(state: FormState, action: { payload: { row: number; proportion: string; } }) {
  const {
    row,
    proportion
  } = action.payload;

  state.recipe.ingredients[row].proportion = proportion;
  state.recipe.totalProportion = state.recipe.ingredients.reduce((x, ingredient) => x + textToNumber(ingredient.proportion), 0);
  state.recipe = updateWeights(state.recipe, -1, state.recipe.totalWeight);

  return state;
}

export default setIngredientProportion;
