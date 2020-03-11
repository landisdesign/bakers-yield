import { FormState } from "../";
import sanitizeText from "./utils/sanitizeText";
import updateWeights from "./utils/updateWeights";
import sanitizeNumber from "./utils/sanitizeNumber";

function removeIngredient(state: FormState, action: { payload: number }) {

  state.recipe.ingredients.splice(action.payload, 1);

  const [weight, proportion] = state.recipe.ingredients.reduce((props, ingredient) => {
    props[0] += sanitizeText(ingredient.weight);
    props[1] += sanitizeText(ingredient.proportion);
    return props;
  }, [0 ,0]);

  state.recipe.totalProportion = proportion;
  updateWeights(state.recipe, -1, sanitizeNumber(weight));

  return state;
}

export default removeIngredient;
