import { createSlice } from '@reduxjs/toolkit';
import { Recipe } from './state';
import { AppThunk } from '.';
import { mergeIngredients, removeStarterRecipe, addStarterRecipe } from './ingredientsSlice';

type Sorter = (a: Recipe, b: Recipe) => number;

const sortByName: Sorter = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
const sortByID: Sorter = (a, b) => a.id - b.id;
const reverse = (sorter: Sorter): Sorter => (a, b) => sorter(a, b) * -1;

const recipeSorter = (byID: boolean, descending: boolean): Sorter => {
    const baseSorter = byID ? sortByID : sortByName;
    return descending ? reverse(baseSorter) : baseSorter;
}

const recipesSlice = createSlice({
    name: 'recipes',
    initialState: {
        list: [] as Recipe[],
        map: {} as { [index: number]: Recipe },
        sortByID: false,
        sortDescending: false,
        id: 0
    },
    reducers: {
        add: {
            reducer(state, action) {
                const recipe = action.payload;
                state.id++;
                const newRecipe = {...recipe, id: state.id};
                state.map[state.id] = newRecipe;
                state.list.push(newRecipe);
                state.list.sort(recipeSorter(state.sortByID, state.sortDescending));
            },
            prepare(recipe: Omit<Recipe, 'id'>) {
                return { payload: recipe };
            }
        },
        update: {
            reducer(state, action) {
                const recipe = action.payload;
                const listIndex = state.list.findIndex(x => recipe.id === x.id);
                if (listIndex != -1) {
                    state.map[recipe.id] = recipe;
                    state.list[listIndex] = recipe;
                    state.list.sort(recipeSorter(state.sortByID, state.sortDescending));
                }
            },
            prepare(recipe: Recipe) {
                return { payload: recipe };
            }
        },
        remove: {
            reducer(state, action) {
              const recipeID = action.payload;
              const listIndex = state.list.findIndex(x => recipeID === x.id);
              state.list.splice(listIndex, 1);
              delete state.map[recipeID];
            },
            prepare(recipeID: number) {
                return { payload: recipeID };
            }
        },
        sortRecipes: {
            reducer(state, action) {
                Object.assign(state, action.payload);
                state.list.sort(recipeSorter(state.sortByID, state.sortDescending));
            },
            prepare(sortByID: boolean, sortDescending: boolean) {
                return { payload: { sortByID, sortDescending } };
            }
        }

    }
});

export default recipesSlice.reducer;
export const { sortRecipes } = recipesSlice.actions;

export const addRecipe = (recipe: Omit<Recipe, 'id'>): AppThunk => async dispatch => {
  dispatch(recipesSlice.actions.add(recipe));
  if (recipe.isStarter) {
    dispatch(addStarterToIngredients(recipe.name));
  }
}

const addStarterToIngredients = (name: string): AppThunk => async (dispatch, getState) => {
  const recipe = getState().recipes.list.find(recipe => recipe.name === name);
  if (recipe) {
    dispatch(addStarterRecipe(recipe));
  }
}

export const removeRecipe = (recipe: Recipe): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const recipeID = recipe.id;
  if (recipeID in state.recipes.map) {
    if (recipe.isStarter) {
      dispatch(removeStarterRecipe(recipe));
    }
    dispatch(mergeIngredients({remove: recipe.ingredients.map(ingredient => ingredient.ingredient)}));
    dispatch(recipesSlice.actions.remove(recipe.id));
  }
}

export const updateRecipe = (recipe: Recipe): AppThunk => async (dispatch, getState) => {
  const oldRecipe = getState().recipes.map[recipe.id];
  if (recipe.isStarter !== oldRecipe.isStarter) {
    if (recipe.isStarter) {
      dispatch(addStarterRecipe(recipe));
    }
    else {
      dispatch(removeStarterRecipe(recipe));
    }
  }
  if (recipe.isStarter && recipe.name !== oldRecipe.name) {
    dispatch(addStarterRecipe(recipe));
  }
  dispatch(recipesSlice.actions.update(recipe));
}

export const __internal_actions_for_testing_purposes_only__ = ((internalActions) => {
  const { add, update, remove } = internalActions;
  return { add, update, remove };
})(recipesSlice.actions);
