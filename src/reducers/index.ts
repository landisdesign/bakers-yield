import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice';
import recipesReducer from './recipesSlice';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  recipes: recipesReducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;
