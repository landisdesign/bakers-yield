import { createSlice } from '@reduxjs/toolkit';
import { defaultIngredientList, Recipe, Ingredient } from './state';

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    list: defaultIngredientList,
    id: defaultIngredientList.length
  },
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
        }
        else {
          state.id++;
          const newIngredient = {
            name,
            starterRecipeID,
            id: state.id,
            recipeCount: 0 // starter recipes are added outside of adding to another reccipe
          }
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
          }
          else {
            delete ingredient.starterRecipeID;
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
    mergeIngredients: {
      reducer(state, action) {
        const {
          add = [],
          remove = []
        }: MergeList = action.payload;

        const maps = state.list.reduce((maps, ingredient, i) => {
          maps.names[ingredient.name.toLowerCase()] = ingredient;
          maps.indices[ingredient.id] = i;
          return maps;
        }, {names:{}, indices:{}} as IngredientsMap);

        add.forEach(name => {
          const cleanedName = name.trim();
          const testName = cleanedName.toLowerCase();
          const oldIngredient = maps.names[testName];
          if (oldIngredient) {
            if (oldIngredient.recipeCount) {
              oldIngredient.recipeCount++;
              return;
            }
          }
          state.id++;
          const ingredient = {
            name: cleanedName,
            recipeCount: 1,
            id: state.id
          }
          maps.names[testName] = ingredient;
          maps.indices[ingredient.id] = state.list.length;
          state.list.push(ingredient);
        });

        let doomedIngredientIndices: number[] = [];
        remove.forEach(id => {
          const doomedIndex = maps.indices[id] ?? -1;
          const ingredient = state.list[doomedIndex];
          if (ingredient && ingredient.recipeCount) {
            ingredient.recipeCount--;
            if (!ingredient.recipeCount && !('starterRecipeID' in ingredient)) {
              doomedIngredientIndices.push(doomedIndex);
              delete maps.indices[id];
            }
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
export const { addStarterRecipe, removeStarterRecipe, updateStarterRecipe, mergeIngredients } = ingredientsSlice.actions;

const sortNames = (a: Ingredient, b: Ingredient) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}

export interface MergeList {
  add?: string[];
  remove?: number[];
}

export interface IngredientsState {
  list: Ingredient[];
  id: number;
}

interface IngredientsMap {
  names: {
    [index: string]: Ingredient;
  };
  indices: {
    [index: number]: number;
  }
}
