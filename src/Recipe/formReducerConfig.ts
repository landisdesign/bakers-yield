import { FormState } from "./Form";
import { ActionDefinitions, ActionDefinition } from "../utils/configureReducer";
import { IngredientRatio, Recipe } from "../reducers/state";

const formReducerConfig: ActionDefinitions<FormState> = {
  addIngredientRow: (action, state) => {
    return {
      ...state,
      recipe: {
        ...state.recipe,
        ingredients: [...state.recipe.ingredients, {ingredientID: -1, proportion: 0, weight: 0, percentage: 0}]
      }
    };
  },
  removeIngredientRow: {
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
  },
  updateIngredientID: ingredientPropertyActionDefinition('ingredientID'),
  updateIngredientWeight: ingredientPropertyActionDefinition('weight'),
  updateIngredientProportion: ingredientPropertyActionDefinition('proportion'),
  updatePortionSize: {
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
  },
  updatePortionCount: {
    prepare(count: number) {
      return { payload: count };
    },
    reduce(action, state) {
      const portionCount = action.payload;
      const totalWeight = portionCount * state.recipe.portionSize;

      let newRecipe = {
        ...state.recipe,
        totalWeight,
        portionCount,
        ingredients: state.recipe.ingredients.map(ingredient => ({...ingredient}))
      };

      return {
        ...state,
        recipe: updateWeights(newRecipe, -1)
      };
    }
  },
  updateTotalWeight: {
    prepare(totalWeight: number) {
      return { payload: totalWeight };
    },
    reduce(action, state) {
      const totalWeight = action.payload;

      let newRecipe = {
        ...state.recipe,
        totalWeight,
        ingredients: state.recipe.ingredients.map(ingredient => ({...ingredient}))
      };

      return {
        ...state,
        recipe: updateWeights(newRecipe, -1)
      };
    }
  }
}

export default formReducerConfig;

const rowOutOfRange = (state: FormState, row: number) => row < 0 || row > state.recipe.ingredients.length;

function ingredientPropertyActionDefinition(key: keyof IngredientRatio): ActionDefinition<FormState> {
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
      if (key === 'proportion') {
        newState.recipe = updateRecipeProportions(newState.recipe);
      }
      if (key === 'weight') {
        newState.recipe = updateWeights(newState.recipe, row);
      }
      return newState;
    }
  });
};

const updateRecipeProportions = (recipe: Recipe) => {
  const totalProportion = recipe.ingredients.reduce((proportion, ingredientRatio) => proportion + ingredientRatio.proportion, 0);

  recipe.ingredients.forEach(ingredient => {
    ingredient.percentage = totalProportion ? ingredient.proportion / totalProportion : 0;
  });
  recipe.totalProportion = totalProportion;

  return recipe;
}

const updateWeights = (recipe: Recipe, keyRow: number) => {
  if (keyRow < -1 || keyRow >= recipe.ingredients.length) {
    return recipe;
  }
  if (keyRow !== -1 && recipe.ingredients[keyRow].proportion === 0) {
    return recipe;
  }

  const keyIngredient = keyRow === -1 ? null : recipe.ingredients[keyRow];
  const totalWeight = keyIngredient === null ? recipe.totalWeight : keyIngredient.weight * recipe.totalProportion / keyIngredient.proportion;

  recipe.ingredients.forEach(ingredient => {
    ingredient.weight = totalWeight * ingredient.proportion / recipe.totalProportion;
  });
  recipe.totalWeight = totalWeight;

  return recipe;
}
