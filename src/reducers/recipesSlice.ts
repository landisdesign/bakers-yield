import { createSlice } from '@reduxjs/toolkit';
import { Recipe } from './state';
import { AppThunk } from '.';
import { removeIngredients } from './ingredientsSlice';

type Sorter = (a: Recipe, b: Recipe) => number;

const sortByName: Sorter = (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
const sortByID: Sorter = (a, b) => a.id - b.id;
const reverse = (sorter: Sorter): Sorter => (a, b) => sorter(a, b) * -1;

const recipeSorter = (byID: boolean, descending: boolean): Sorter => {
    const baseSorter = byID ? sortByID : sortByName;
    return descending ? reverse(baseSorter) : baseSorter;
}

const recipesReducer = createSlice({
    name: 'recipes',
    initialState: {
        list: [] as Recipe[],
        map: {} as { [index: number]: Recipe },
        sortByID: false,
        sortDescending: false,
        id: 0
    },
    reducers: {
        addRecipe: {
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
        updateRecipe: {
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
        sortRecipe: {
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

export default recipesReducer.reducer;
export const { addRecipe, updateRecipe, sortRecipe } = recipesReducer.actions;

export const removeRecipe = (recipe: Recipe): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const recipeID = recipe.id;
  if (recipeID in state.recipes.map) {
    dispatch(removeIngredients(recipe.ingredients.map(ingredient => ingredient.ingredientID)));
    dispatch(recipesReducer.actions.remove(recipe.id));
  }
}
