import { createSlice } from "@reduxjs/toolkit";

import { defaultState } from "./state";
import * as addRecipeReducer from './actions/addRecipe';
import * as removeRecipeReducer from './actions/removeRecipe';
import * as updateRecipeReducer from './actions/updateRecipe';

const reducer = createSlice({
  name: 'root',
  initialState: defaultState,
  reducers: {
    addRecipe: addRecipeReducer,
    removeRecipe: removeRecipeReducer,
    updateRecipe: updateRecipeReducer
  }
});

const { addRecipe, removeRecipe, updateRecipe } = reducer.actions;

export default reducer;
export { addRecipe, removeRecipe, updateRecipe };
