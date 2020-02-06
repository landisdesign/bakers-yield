import { createSlice } from '@reduxjs/toolkit';
import { Ingredient } from './state';

const rebuildList = (ingredients: Ingredient[]) => ingredients.reduce(
  (typeaheadList, ingredient) => typeaheadList + `${ingredient.name.toLowerCase()}¬${ingredient.id}¬${ingredient.starterRecipeID ? '1' : '0'}\n`,
  ''
);

const ingredientsReducer = createSlice({
  name: 'ingredients',
  initialState: {
    list: [] as Ingredient[],
    typeaheadList: ''
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

        const newIngredient = {
          ...action.payload
        };
        if (!newIngredient.starterRecipeID) {
          newIngredient.recipeCount = 1;
        }
        state.list.push(newIngredient);
        state.typeaheadList = rebuildList(state.list);
      },
      prepare(payload: Omit<Ingredient, 'recipeCount'>) {
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
            state.typeaheadList = rebuildList(state.list);
          }
        }
      },
      prepare(id: string) {
        return { payload: id };
      }
    }
  }
});

export default ingredientsReducer.reducer;
export const { add, remove } = ingredientsReducer.actions;
