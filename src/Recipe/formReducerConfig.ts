import { FormState } from "./Form";
import configureReducer, { ActionDefinition, Action, ActionReducer, wrapActionDefinitions } from "../utils/configureReducer";
import { IngredientRatio, Ingredient } from "../reducers/state";

const formReducerConfig = wrapActionDefinitions({
  addIngredientRow: addIngredientRowReducer(),
  removeIngredientRow: removeIngredientRowReducer(),
  updateIngredientID: updateIngredientPropertyReducer('ingredientID'),
  updateIngredientWeight: updateIngredientPropertyReducer('weight', updateWeightsProcessor),
  updateIngredientProportion: updateIngredientPropertyReducer('proportion', updateRecipeProportionsProcessor),
  addNewIngredient: addNewIngredientReducer(),
  removeNewIngredient: removeNewIngredientReducer(),
  updatePortionSize: updatePortionSizeReducer(),
  updatePortionCount: updatePortionCountReducer(),
  updateTotalWeight: updateTotalWeightReducer(),
  updateIngredientMatchList: updateIngredientMatchListReducer()
});

const reducer = configureReducer(formReducerConfig);
const {
  addIngredientRow,
  removeIngredientRow,
  updateIngredientID,
  updateIngredientWeight,
  updateIngredientProportion,
  addNewIngredient,
  removeNewIngredient,
  updatePortionSize,
  updatePortionCount,
  updateTotalWeight,
  updateIngredientMatchList,
} = reducer.actions;
export default reducer;
export {
  addIngredientRow,
  removeIngredientRow,
  updateIngredientID,
  updateIngredientWeight,
  updateIngredientProportion,
  addNewIngredient,
  removeNewIngredient,
  updatePortionSize,
  updatePortionCount,
  updateTotalWeight,
  updateIngredientMatchList,
};

/*
  Case Reducers
*/
function addIngredientRowReducer() {
  return function(_: Action, state: FormState) {
    return {
      ...state,
      recipe: {
        ...state.recipe,
        ingredients: [...state.recipe.ingredients, {ingredientID: -1, proportion: 0, weight: 0, percentage: 0}]
      }
    };
  }
}

function removeIngredientRowReducer(): ActionDefinition<FormState> {
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

function updateIngredientPropertyReducer(key: keyof IngredientRatio, postProcessor?: ActionReducer<FormState>): ActionDefinition<FormState> {
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
      }: {row: number, value: number} = action.payload;

      if (rowOutOfRange(state, row)) {
        return state;
      }

      const newState: FormState = {
        ...state,
        recipe: {
          ...state.recipe,
          ingredients: state.recipe.ingredients.map((ingredient, i) => i === row ? {...ingredient, [key]: value} : {...ingredient})
        }
      };
      return postProcessor ? postProcessor(action, newState) : newState;
    }
  });
};

function addNewIngredientReducer(): ActionDefinition<FormState> {
  return {
    prepare(name: string) {
      return { payload: name};
    },
    reduce(action, state) {
      const name = action.payload;
      const newState: FormState = {
        ...state,
        newIngredients: [...state.newIngredients]
      }
      newState.ingredientId--;
      const newIngredient: Ingredient = {
        id: newState.ingredientId,
        name
      };
      newState.newIngredients.push(newIngredient);
      return newState;
    }
  };
}

function removeNewIngredientReducer(): ActionDefinition<FormState> {
  return {
    prepare(ingredient: Ingredient) {
      return { payload: ingredient.id};
    },
    reduce(action, state) {
      const id = action.payload;
      const newIngredients = [...state.newIngredients];
      const doomedIndex = newIngredients.findIndex(ingredient => ingredient.id === id);

      if (doomedIndex === -1) {
        return state;
      }

      newIngredients.splice(doomedIndex, 1);

      return {
        ...state,
        newIngredients
      };
    }
  };
}

function updatePortionSizeReducer(): ActionDefinition<FormState> {
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

function updatePortionCountReducer(): ActionDefinition<FormState> {
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

      return updateWeightsProcessor({ type: '', payload: { row: -1 } }, newState);
    }
  };
}

function updateTotalWeightReducer(): ActionDefinition<FormState> {
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

      return updateWeightsProcessor({ type: '', payload: { row: -1 } }, newState);
    }
  };
}

/*
  Ingredient postprocessors
*/

function updateRecipeProportionsProcessor(_: Action, state: FormState) {
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

function updateWeightsProcessor(action: Action, state: FormState) {
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

function updateIngredientMatchListReducer(): ActionReducer<FormState> {
  return function(_, state){
    const ingredients = state.newIngredients.concat(state.existingIngredients).sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
    });
    return {
      ...state,
      ingredientMatchText: ingredients.reduce((text, ingredient) => `${text}${ingredient.name}${'starterRecipeID' in ingredient ? ' •' : ''}¬${ingredient.id}\n`, '')
    };
  };
}

const rowOutOfRange = (state: FormState, row: number) => row < 0 || row > state.recipe.ingredients.length;
