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
    mergeIngredients: {
      reducer(state, action) {
        const {
          add = [],
          remove = []
        }: MergeList = action.payload;

        const nameMap = state.list.reduce((names, ingredient, i) => {
          names[ingredient.name.toLowerCase()] = i;
          return names;
        }, {} as NameMap);

        add.forEach(name => {
          const cleanedName = name.trim();
          const testName = cleanedName.toLowerCase();
          if (testName in nameMap) {
            const ingredient = state.list[nameMap[testName]];
            if (ingredient.recipeCount) {
              ingredient.recipeCount++;
            }
            return;
          }
          state.id++;
          const ingredient = {
            name: cleanedName,
            recipeCount: 1,
            id: state.id
          }
          nameMap[testName] = state.list.length;
          state.list.push(ingredient);
        });

        let doomedIngredientIndices: number[] = [];
        remove.forEach(name => {
          const testName = name.trim().toLowerCase();
          const doomedIndex = nameMap[testName] ?? -1;
          const ingredient = state.list[doomedIndex];
          if (ingredient && ingredient.recipeCount) {
            ingredient.recipeCount--;
            if (!ingredient.recipeCount && !('starterRecipeID' in ingredient)) {
              doomedIngredientIndices.push(doomedIndex);
              delete nameMap[testName];
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
export const { addStarterRecipe, removeStarterRecipe, mergeIngredients } = ingredientsSlice.actions;

const sortNames = (a: Ingredient, b: Ingredient) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0);
}

export interface MergeList {
  add?: string[];
  remove?: string[];
}

export interface IngredientsState {
  list: Ingredient[];
  id: number;
}

interface NameMap {
  [index: string]: number;
}
