import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice';
import measuresReducer from './measuresSlice';
import recipesReducer from './recipesSlice';

const reducer = combineReducers({
  ingredients: ingredientsReducer,
  measures: measuresReducer,
  recipes: recipesReducer
});

export type RootState = ReturnType<typeof reducer>;

export default reducer;