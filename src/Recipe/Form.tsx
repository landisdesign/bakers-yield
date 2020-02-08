import React, { useReducer, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import Table from '@material-ui/core/Table';

import { Recipe, Measure, defaultIngredientRatios, Ingredient } from '../reducers/state';
import { RootState } from '../reducers';

import IngredientRow from './IngredientRow';

interface FormProps {
  recipeID?: number;
  edit?: boolean;
  readonly?: boolean;
}

interface RecipeState {
  recipe: Recipe;
  measure: Measure;
}

export type FormState = RecipeState & Required<Omit<FormProps, 'recipeID'>>;

const Form: React.FC<FormProps> = (props) => {
  const {
    recipeID = -1,
    edit = recipeID === -1,
    readonly = false
  } = props;

  const ingredients = useSelector<RootState, Ingredient[]>(state => state.ingredients.list, (a, b) => a.length === b.length);

  const getRecipeForID = useCallback(state => getRecipe(state, recipeID), [recipeID]);
  const recipeState = useSelector<RootState, Omit<FormState, 'readonly' | 'edit'>>(getRecipeForID);
  const initialState = Object.assign({edit, readonly}, recipeID === -1 ? defaultState : recipeState);

  const [formState, formDispatch] = useReducer(formReducer, initialState);

  return (
    <form>
      <Table>
        { formState.recipe.ingredients.map((_, i) => <IngredientRow row={i} ingredients={ingredients} state={formState} dispatch={formDispatch} />) }
      </Table>
    </form>
  );
}

const getRecipe = createSelector(
  (state: RootState, recipeID: number) => state.recipes.map[recipeID],
  (state: RootState, recipeID: number) => state.measures[recipeID],
  (recipe: Recipe, measure: Measure) => ({recipe, measure})
);

const defaultState: Omit<FormState, 'readonly' | 'edit'> = {
  recipe: {
    name: '',
    id: 0,
    isStarter: false,
    ingredients: defaultIngredientRatios,
    totalProportion: 0,
    measureByPortion: true,
    portionSize: 0
  },
  measure: {
    recipeID: 0,
    weights: (new Array(defaultIngredientRatios.length)).fill(0) as number[],
    totalWeight: 0,
    portions: 0
  }
};

const formReducer = (action: any, state: FormState) => {
  return state;
}

export default Form;