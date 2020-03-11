import { FormState } from "../";
import textToNumber from "./utils/textToNumber";
import updateWeights from "./utils/updateWeights";
import numberToText from "./utils/numberToText";
import updatePercentages from "./utils/updatePercentages";

function removeIngredient(state: FormState, action: { payload: number }) {

  let recipe = state.recipe;

  recipe.ingredients.splice(action.payload, 1);

  const [weight, proportion] = recipe.ingredients.reduce((props, ingredient) => {
    props[0] += textToNumber(ingredient.weight);
    props[1] += textToNumber(ingredient.proportion);
    return props;
  }, [0 ,0]);

  recipe.totalProportion = proportion;

  updatePercentages(updateWeights(state.recipe, -1, numberToText(weight)));

  return state;
}

export default removeIngredient;
