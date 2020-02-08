import { createSlice } from '@reduxjs/toolkit';
import { Recipe } from './state';

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
                if (listIndex != -1) {
                    state.list.splice(listIndex, 1);
                    delete state.map[recipeID];
                }
            },
            prepare(recipe: Recipe) {
                return { payload: recipe.id };
            }
        },
        sort: {
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
export const { add, update, remove, sort } = recipesReducer.actions;
