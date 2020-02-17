import { createSlice } from '@reduxjs/toolkit';
import { defaultIngredientList, Recipe, Ingredient } from './state';
import  { isTempIngredient } from '../utils/tempIngredientManager';
 '../utils/tempIngredientManager';

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    list: defaultIngredientList,
    id: defaultIngredientList.length,
    map: defaultIngredientList.reduce((ids, ingredient) => {
      ids[ingredient.id] = ingredient;
      return ids;
    }, {} as IngredientMap),
    tempMap: {}
  } as IngredientsState,
  reducers: {
    addStarterRecipe: {
      reducer(state, action) {
        const {
          name,
          starterRecipeID
        } = action.payload;
        const testName = name.toLowerCase();
        const oldIngredient = state.list.find(ingredient => ingredient.name.toLowerCase() === testName);
        if (oldIngredient) {
          oldIngredient.name = name;
          oldIngredient.starterRecipeID = starterRecipeID;
          // Immer doesn't keep reference between list and map object
          state.map[oldIngredient.id] = oldIngredient;
        }
        else {
          state.id++;
          const newIngredient = {
            name,
            starterRecipeID,
            id: state.id,
            recipeCount: 0 // starter recipes are added outside of adding to another reccipe
          };
          state.map[newIngredient.id] = newIngredient;
          state.list.push(newIngredient);
          state.list.sort();
        }
      },
      prepare(recipe: Recipe) {
        return {
          payload: {
            name: recipe.name,
            starterRecipeID: recipe.id
          }
        };
      }
    },
    removeStarterRecipe: {
      reducer(state, action) {
        const id = action.payload;
        const ingredientIndex = state.list.findIndex(ingredient => ingredient.starterRecipeID === id);
        const ingredient = state.list[ingredientIndex];
        if (ingredient) {
          if ('recipeCount' in ingredient && !ingredient.recipeCount) {
            state.list.splice(ingredientIndex, 1);
            delete state.map[ingredient.id];
          }
          else {
            delete ingredient.starterRecipeID;
            // Immer doesn't keep reference between list and map object
            delete state.map[ingredient.id].starterRecipeID;
          }
        }
      },
      prepare(recipe: Recipe) {
        return {
          payload: recipe.id
        };
      }
    },
    updateStarterRecipe: {
      reducer(state, action) {
        const {
          name,
          id
        } = action.payload;
        const ingredient = state.list.find(ingredient => ingredient.starterRecipeID === id);
        if (ingredient) {
          ingredient.name = name;
          // Immer doesn't keep reference between list and map object
          state.map[ingredient.id].name = name;
        }
      },
      prepare(recipe: Recipe) {
        return {
          payload: {
            id: recipe.id,
            name: recipe.name
          }
        }
      }
    },
    updateRecipeIngredients: {
      reducer(state, action) {
        const recipe: Recipe = action.payload;
        recipe.ingredients.forEach(ingredientRatio => {
          const realID = state.tempMap[ingredientRatio.ingredientID];
          if (realID) {
            delete state.tempMap[ingredientRatio.ingredientID];
            ingredientRatio.ingredientID = realID;
          }
        });
      },
      prepare(recipe: Recipe) {
        return { payload: recipe };
      }
    },
    mergeIngredients: {
      reducer(state, action) {
        const {
          add = [],
          remove = []
        }: MergeList = action.payload;

        const indexMap = state.list.reduce((map, ingredient, i) => {
          map[ingredient.id] = i;
          return map;
        }, {} as {[index: number]: number});

        add.forEach(ingredient => {
          const oldIngredient = state.list[indexMap[ingredient.id] ?? -1];
          if (oldIngredient) {
            if ('recipeCount' in oldIngredient) {
              oldIngredient.recipeCount!++;
            }
            return;
          }
          state.id++;
          const newIngredient = {
            name: ingredient.name,
            recipeCount: 1,
            id: state.id
          };

          if (isTempIngredient(ingredient)) {
            state.tempMap[ingredient.id] = newIngredient.id;
          }

          indexMap[newIngredient.id] = state.list.length;
          state.list.push(newIngredient);
          state.map[newIngredient.id] = newIngredient;
        });

        let doomedIngredientIndices: number[] = [];
        remove.forEach(ingredient => {
          const doomedIndex = indexMap[ingredient.id] ?? -1;
          const doomedIngredient = state.list[doomedIndex];
          if (doomedIngredient && doomedIngredient.recipeCount) {
            doomedIngredient.recipeCount--;
            if (!doomedIngredient.recipeCount && !('starterRecipeID' in doomedIngredient)) {
              doomedIngredientIndices.push(doomedIndex);
              delete indexMap[doomedIngredient.id];
              delete state.map[doomedIngredient.id];
            }
            else {
              // Immer doesn't keep reference between list and map object
              state.map[doomedIngredient.id] = doomedIngredient;
            }
          }
          if (isTempIngredient(ingredient)) {
            delete state.tempMap[ingredient.id];
          }
        });
        doomedIngredientIndices.sort((a, b) => b - a); // reverse to permit splicing from end backwards
        doomedIngredientIndices.forEach(doomedIndex => state.list.splice(doomedIndex, 1));

        state.list.sort(sortNames);
      },
      prepare({ add, remove }: MergeList) {
        return {
          payload: { add, remove }
        };
      }
    }
  }
});

export default ingredientsSlice.reducer;
export const { addStarterRecipe, removeStarterRecipe, updateStarterRecipe, updateRecipeIngredients, mergeIngredients } = ingredientsSlice.actions;

const sortNames = (a: Ingredient, b: Ingredient) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}

export interface MergeList {
  add?: Ingredient[];
  remove?: Ingredient[];
}

interface IngredientMap {
  [index: number]: Ingredient;
}

export interface IngredientsState {
  list: Ingredient[];
  id: number;
  map: IngredientMap;
  tempMap: {[index: number]: number};
}
