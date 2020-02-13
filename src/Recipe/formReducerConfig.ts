import { FormState } from "./Form";
import { ActionDefinition, Action, ActionReducer, wrapActionDefinitions } from "../utils/configureReducer";
import { IngredientRatio } from "../reducers/state";

const formReducerConfig = wrapActionDefinitions({
  addIngredientRow,
  removeIngredientRow: removeIngredientRow(),
  updateIngredientID: updateIngredientProperty('ingredientID'),
  updateIngredientWeight: updateIngredientProperty('weight', updateWeights),
  updateIngredientProportion: updateIngredientProperty('proportion', updateRecipeProportions),
  updatePortionSize: updatePortionSize(),
  updatePortionCount: updatePortionCount(),
  updateTotalWeight: updateTotalWeight()
});

export default formReducerConfig;

/*
  Case Reducers
*/
function addIngredientRow(_: Action, state: FormState) {
  return {
    ...state,
    recipe: {
      ...state.recipe,
      ingredients: [...state.recipe.ingredients, {ingredientID: -1, proportion: 0, weight: 0, percentage: 0}]
    }
  };
}

function removeIngredientRow(): ActionDefinition<FormState> {
  return {
    prepare(row: number){
      return { payload: row };
    },
    reduce(action, state){
      const row = action.payload;

      if (rowOutOfRange(state, row)) {
        return state;
      }

      return {
        ...state,
        recipe: {
          ...state.recipe,
          ingredients: state.recipe.ingredients.filter((_, i) => i !== row)
        }
      };
    }
  };
}

function updateIngredientProperty(key: keyof IngredientRatio, postProcessor?: ActionReducer<FormState>): ActionDefinition<FormState> {
  return ({
    prepare(row: number, value: number) {
      return {
        payload: {
          row,
          value
        }
      };
    },
    reduce(action, state) {
      const {
        row,
        value
      } = action.payload;

      if (rowOutOfRange(state, row)) {
        return state;
      }

      let newState = {
        ...state,
        recipe: {
          ...state.recipe,
          ingredients: state.recipe.ingredients.map(ingredient => ({...ingredient}))
        }
      };
      newState.recipe.ingredients[row][key] = value;
      return postProcessor ? postProcessor(action, newState) : newState;
    }
  });
};

function updatePortionSize(): ActionDefinition<FormState> {
  return {
    prepare(portionSize: number) {
      return { payload: portionSize };
    },
    reduce(action, state) {
      return ({
        ...state,
        recipe: {
          ...state.recipe,
          portionSize: action.payload
        }
      })
    }
  };
}

function updatePortionCount(): ActionDefinition<FormState> {
  return {
    prepare(count: number) {
      return { payload: count };
    },
    reduce(action, state) {
      const portionCount = action.payload;
      const totalWeight = portionCount * state.recipe.portionSize;

      let newState = {
        ...state,
        recipe: {
          ...state.recipe,
          totalWeight,
          portionCount,
          ingredients: state.recipe.ingredients.map(ingredient => ({...ingredient}))
        }
      };

      return updateWeights({ type: '', payload: { row: -1 } }, newState);
    }
  };
}

function updateTotalWeight(): ActionDefinition<FormState> {
  return {
    prepare(totalWeight: number) {
      return { payload: totalWeight };
    },
    reduce(action, state) {
      const totalWeight = action.payload;

      let newState = {
        ...state,
        recipe: {
          ...state.recipe,
          totalWeight,
          ingredients: state.recipe.ingredients.map(ingredient => ({...ingredient}))
        }
      };

      return updateWeights({ type: '', payload: { row: -1 } }, newState);
    }
  };
}

/*
  Ingredient postprocessors
*/

function updateRecipeProportions(_: Action, state: FormState) {
  const {
    recipe
  } = state;
  const totalProportion = recipe.ingredients.reduce((proportion, ingredientRatio) => proportion + ingredientRatio.proportion, 0);

  recipe.ingredients.forEach(ingredient => {
    ingredient.percentage = totalProportion ? ingredient.proportion / totalProportion : 0;
  });
  recipe.totalProportion = totalProportion;

  return state;
}

function updateWeights(action: Action, state: FormState) {
  const {
    payload: { row }
  } = action;
  const {
    recipe
  } = state;

  if (row < -1 || row >= recipe.ingredients.length) {
    return state;
  }
  if (row !== -1 && recipe.ingredients[row].proportion === 0) {
    return state;
  }

  const keyIngredient = row === -1 ? null : recipe.ingredients[row];
  const totalWeight = keyIngredient === null ? recipe.totalWeight : keyIngredient.weight * recipe.totalProportion / keyIngredient.proportion;

  recipe.ingredients.forEach(ingredient => {
    ingredient.weight = totalWeight * ingredient.proportion / recipe.totalProportion;
  });
  recipe.totalWeight = totalWeight;

  return state;
}

const rowOutOfRange = (state: FormState, row: number) => row < 0 || row > state.recipe.ingredients.length;
