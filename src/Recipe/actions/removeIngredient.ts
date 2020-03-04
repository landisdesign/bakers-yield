import { FormState } from "../Form";

function removeIngredient(state: FormState, action: { payload: number }) {

  state.recipe.ingredients.splice(action.payload, 1);

  Object.assign(state.recipe, state.recipe.ingredients.reduce((props, ingredient) => {
    props.totalWeight += ingredient.weight;
    props.totalProportion += ingredient.proportion;
    return props;
  }, { totalWeight: 0, totalProportion: 0}));

  return state;
}

export default removeIngredient;
