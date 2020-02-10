import { createSlice } from '@reduxjs/toolkit';
import { Ingredient, defaultIngredientList } from './state';

const ingredientsReducer = createSlice({
  name: 'ingredients',
  initialState: {
    list: defaultIngredientList,
    id: defaultIngredientList.length
  },
  reducers: {
    addIngredient: {
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
    removeIngredient: {
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
            state.list.splice(ingredientIndex, 1);
          }
        }
      },
      prepare(id: number) {
        return { payload: id };
      }
    },
    removeIngredients: {
      reducer(state, action) {
        const ids: number[] = action.payload;
        const indices = ids
          .map(id => state.list.findIndex(x => x.id === id))
          .sort((a,b) => b - a) // reverse to permit splicing without disrupting earlier list order
        ;

        indices.forEach(index => {
          const ingredient = state.list[index];
          if (!ingredient || !('recipeCount' in ingredient)) { // previously deleted in loop or undeleteable
            return;
          }
          if (ingredient.recipeCount) {
            ingredient.recipeCount--;
            if (!ingredient.recipeCount) {
              state.list.splice(index, 1);
            }
          }
        });
      },
      prepare(ids: number[]) {
        return { payload: ids };
      }
    }
  }
});

export default ingredientsReducer.reducer;
export const { addIngredient, removeIngredient, removeIngredients } = ingredientsReducer.actions;
