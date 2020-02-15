import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers';
import { Recipe, defaultIngredientRatios, Ingredient } from '../reducers/state';

import arraysEqual from '../utils/arraysEqual';
import configureReducer from '../utils/configureReducer';
import objectsEqual from '../utils/objectsEqual';

import IngredientRow from './IngredientRow';
import formReducerConfig from './formReducerConfig';

interface FormProps {
  recipeID?: number;
  edit?: boolean;
  readonly?: boolean;
}

export type FormState = Required<Omit<FormProps, 'recipeID'>> & {
  recipe: Recipe;
};

const Form: React.FC<FormProps> = (props) => {
  const {
    recipeID = -1,
    edit = recipeID === -1,
    readonly = false
  } = props;

  const ingredients = useSelector<RootState, Ingredient[]>(state => state.ingredients, (a, b) => a.length === b.length);
  const recipe = useSelector<RootState, Recipe>(getRecipe(recipeID), recipeUnchanged) || defaultRecipe;
  const initialState = {
    edit,
    readonly,
    recipe
  };

  const reducer = configureReducer(formReducerConfig);
  const [formState, formDispatch] = useReducer(reducer, initialState);

  return (
    <form>
      <table>
        { formState.recipe.ingredients.map((_: any, i: number) => <IngredientRow row={i} ingredients={ingredients} state={formState} dispatch={formDispatch} />) }
      </table>
    </form>
  );
}

const getRecipe = (recipeID: number) => (state: RootState) => state.recipes.map[recipeID];

const recipeUnchanged = (a: Recipe, b: Recipe) => {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  return objectsEqual(a, b, {
    ingredients: arraysEqual(objectsEqual())
  })
}

const defaultRecipe: Recipe = {
  name: '',
  id: -1,
  isStarter: false,
  ingredients: defaultIngredientRatios,
  totalProportion: 0,
  totalWeight: 0,
  measureByPortion: true,
  portionSize: 0,
  portionCount: 0
};

export default Form;
