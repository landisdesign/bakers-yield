import { createSlice } from '@reduxjs/toolkit';
import { Ingredient, defaultIngredientList } from './state';

const ingredientsReducer = createSlice({
  name: 'ingredients',
  initialState: {
    list: defaultIngredientList,
    id: defaultIngredientList.length
  },
  reducers: {
    add: {
      reducer(state, action) {
        let { name } = action.payload;
        name = name.trim();
        const testName = name.toLowerCase();

        const existingIngredient = state.list.find(x => x.name.toLowerCase() === testName);
        if (existingIngredient) {
          if (!existingIngredient.starterRecipeID && existingIngredient.recipeCount) {
            existingIngredient.recipeCount++;
          }
          return;
        }

        state.id++;
        const newIngredient = {
          ...action.payload,
          id: state.id
        };
        if (!newIngredient.starterRecipeID) {
          newIngredient.recipeCount = 1;
        }
        state.list.push(newIngredient);
        state.list.sort();
      },
      prepare(payload: Omit<Ingredient, 'recipeCount' | 'id'>) {
        return { payload };
      }
    },
    remove: {
      reducer(state, action) {
        const id = action.payload;

        const ingredientIndex = state.list.findIndex(x => x.id === id);
        if (ingredientIndex === -1) {
          return;
        }

        const ingredient = state.list[ingredientIndex];
        if (ingredient.recipeCount) {
          ingredient.recipeCount--;
          if (!ingredient.recipeCount) {
            state.list.slice(ingredientIndex, 1);
          }
        }
      },
      prepare(id: number) {
        return { payload: id };
      }
    }
  }
});

export default ingredientsReducer.reducer;
export const { add, remove } = ingredientsReducer.actions;