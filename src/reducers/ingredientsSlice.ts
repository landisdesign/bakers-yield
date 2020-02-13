import { createSlice } from '@reduxjs/toolkit';
import { defaultIngredientList } from './state';

const ingredientsReducer = createSlice({
  name: 'ingredients',
  initialState: defaultIngredientList,
  reducers: {
    mergeIngredients: {
      reducer(state, action) {
        const {
          add = [],
          remove = []
        }: MergeList = action.payload;

        const nameMap = state.reduce((names, ingredient, i) => {
          names[ingredient.name] = i;
          return names;
        }, {} as NameMap);

        add.forEach(name => {
          if (name in nameMap) {
            const ingredient = state[nameMap[name]];
            if (ingredient.recipeCount) {
              ingredient.recipeCount++;
            }
            return;
          }
          const ingredient = {
            name,
            recipeCount: 1
          }
          nameMap[name] = state.length;
          state.push(ingredient);
        });

        let doomedIngredientIndices: number[] = [];
        remove.forEach(name => {
          const doomedIndex = nameMap[name] ?? -1;
          const ingredient = state[doomedIndex];
          if (ingredient && ingredient.recipeCount) {
            ingredient.recipeCount--;
            if (!ingredient.recipeCount) {
              doomedIngredientIndices.push(doomedIndex);
            }
          }
        });
        doomedIngredientIndices.sort((a, b) => b - a); // reverse to permit splicing from end backwards
        doomedIngredientIndices.forEach(doomedIndex => state.splice(doomedIndex, 1));

        state.sort();
      },
      prepare({ add, remove }: MergeList) {
        return {
          payload: { add, remove }
        };
      }
    }
  }
});

export default ingredientsReducer.reducer;
export const { mergeIngredients } = ingredientsReducer.actions;

interface MergeList {
  add?: string[];
  remove?: string[];
}

interface NameMap {
  [index: string]: number;
}
