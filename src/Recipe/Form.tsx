import React, { useReducer, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers';
import { Recipe, defaultIngredientRatios, Ingredient } from '../reducers/state';

import arraysEqual from '../utils/arraysEqual';
import objectsEqual from '../utils/objectsEqual';

import IngredientRow from './IngredientRow';
import reducer, { updateIngredientMatchList } from './formReducerConfig';

interface FormProps {
  recipeID?: number;
  edit?: boolean;
  readonly?: boolean;
}

export type FormState = Required<Omit<FormProps, 'recipeID'>> & {
  recipe: Recipe;
  existingIngredients: Ingredient[];
  newIngredients: Ingredient[];
  ingredientMatchText: string;
  ingredientId: number;
};

const Form: React.FC<FormProps> = (props) => {
  const {
    recipeID = -1,
    edit = recipeID === -1,
    readonly = false
  } = props;

  const existingIngredients = useSelector<RootState, Ingredient[]>(state => state.ingredients.list, (a, b) => a.length === b.length);
  const storedRecipe = useSelector<RootState, Recipe>(getRecipe(recipeID), recipeUnchanged) || defaultRecipe;
  const initialState: FormState = useMemo(() => (
    {
      edit,
      readonly,
      existingIngredients,
      newIngredients: [],
      recipe: {
        ...storedRecipe,
        ingredients: [...storedRecipe.ingredients]
      },
      ingredientList: '',
      ingredientId: -1,
      ingredientMatchText: ''
    }
  ), [edit, readonly, existingIngredients, storedRecipe]);

  const [formState, formDispatch]: [FormState, React.Dispatch<FormState>] = useReducer(reducer, initialState, (state) => updateIngredientMatchList({}, state));

  return (
    <form>
      <table>
        { formState.recipe.ingredients.map((_, i: number) => <IngredientRow row={i} state={formState} dispatch={formDispatch} />) }
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
