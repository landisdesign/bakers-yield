import { combineReducers, Action } from 'redux';
import ingredientsReducer from './ingredientsSlice';
import recipesReducer from './recipesSlice';
import { ThunkAction } from '@reduxjs/toolkit';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  recipes: recipesReducer
});

export default reducer;

export type RootState = ReturnType<typeof reducer>;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
