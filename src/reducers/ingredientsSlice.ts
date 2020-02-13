import { createSlice } from '@reduxjs/toolkit';
import { defaultIngredientList, Recipe, Ingredient } from './state';

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: defaultIngredientList,
  reducers: {
    addStarterRecipe: {
      reducer(state, action) {
        const {
          name,
          starterRecipeID
        } = action.payload;
        const testName = name.toLowerCase();
        const oldIngredient = state.find(ingredient => ingredient.name.toLowerCase() === testName);
        if (oldIngredient) {
          oldIngredient.name = name;
          oldIngredient.starterRecipeID = starterRecipeID;
        }
        else {
          const newIngredient = {
            name,
            starterRecipeID,
            recipeCount: 0 // starter recipes are added outside of adding to another reccipe
          }
          state.push(newIngredient);
          state.sort();
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
        const name = action.payload;
        const testName = name.toLowerCase();
        const ingredientIndex = state.findIndex(ingredient => ingredient.name.toLowerCase() === testName);
        const ingredient = state[ingredientIndex];
        if (ingredient) {
          if ('recipeCount' in ingredient && !ingredient.recipeCount) {
            state.splice(ingredientIndex, 1);
          }
          else {
            delete ingredient.starterRecipeID;
          }
        }
      },
      prepare(recipe: Recipe) {
        return {
          payload: recipe.name
        };
      }
    },
    mergeIngredients: {
      reducer(state, action) {
        const {
          add = [],
          remove = []
        }: MergeList = action.payload;

        const nameMap = state.reduce((names, ingredient, i) => {
          names[ingredient.name.toLowerCase()] = i;
          return names;
        }, {} as NameMap);

        add.forEach(name => {
          const cleanedName = name.trim();
          const testName = cleanedName.toLowerCase();
          if (testName in nameMap) {
            const ingredient = state[nameMap[testName]];
            if (ingredient.recipeCount) {
              ingredient.recipeCount++;
            }
            return;
          }
          const ingredient = {
            name: cleanedName,
            recipeCount: 1
          }
          nameMap[testName] = state.length;
          state.push(ingredient);
        });

        let doomedIngredientIndices: number[] = [];
        remove.forEach(name => {
          const testName = name.trim().toLowerCase();
          const doomedIndex = nameMap[testName] ?? -1;
          const ingredient = state[doomedIndex];
          if (ingredient && ingredient.recipeCount) {
            ingredient.recipeCount--;
            if (!ingredient.recipeCount && !('starterRecipeID' in ingredient)) {
              doomedIngredientIndices.push(doomedIndex);
              delete nameMap[testName];
            }
          }
        });
        doomedIngredientIndices.sort((a, b) => b - a); // reverse to permit splicing from end backwards
        doomedIngredientIndices.forEach(doomedIndex => state.splice(doomedIndex, 1));

        state.sort(sortNames);
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

interface MergeList {
  add?: string[];
  remove?: string[];
}

interface NameMap {
  [index: string]: number;
}
