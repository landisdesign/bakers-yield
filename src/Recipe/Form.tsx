import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocalSlice } from 'use-local-slice';
import styled from 'styled-components';

import { ApplicationState } from '../reducer/state';
import { Recipe, defaultIngredientRatios, Ingredient } from '../reducer/state';

import arraysEqual from '../utils/arraysEqual';
import objectsEqual from '../utils/objectsEqual';

import * as reducers from './actions';
import IngredientRow from './IngredientRow';
import { TiTickOutline, TiTimesOutline, TiPlusOutline } from 'react-icons/ti';
import Footer from './Footer';
interface FormProps {
  recipeID?: number;
  edit?: boolean;
  readonly?: boolean;
}

export type FormState = Required<Omit<FormProps, 'recipeID'>> & {
  recipe: Recipe;
  ingredients: Ingredient[];
  ingredientsMap: { [index: string]: number};
  ingredientMatchText: string;
};

const Form: React.FC<FormProps> = (props) => {
  const {
    recipeID = -1,
    edit = recipeID === -1,
    readonly = false
  } = props;

  const ingredients = useSelector<ApplicationState, Ingredient[]>(state => state.ingredients.list, (a, b) => a.length === b.length);
  const ingredientsMap = useMemo(() => ingredients.reduce((map, ingredient) => {
    map[ingredient.name.toLowerCase()] = ingredient.id;
    return map;
  }, {} as {[index: string]: number}), [ingredients]);
  // I don't use template literals because the literal newline messes with auto indenting
  const ingredientMatchText = useMemo(() => ingredients.reduce((text, ingredient) => text + ingredient.name + '¬' + ingredient.id + '\n', ''), [ingredients]);

  const storedRecipe = useSelector<ApplicationState, Recipe>(getRecipe(recipeID), recipeUnchanged) || defaultRecipe;
  const initialState: FormState = useMemo(() => (
    {
      edit,
      readonly,
      ingredients,
      ingredientsMap,
      recipe: {
        ...storedRecipe,
        ingredients: [...storedRecipe.ingredients]
      },
      ingredientMatchText
    }
  ), [edit, readonly, ingredients, storedRecipe, ingredientsMap, ingredientMatchText]);

  const [formState, formDispatch] = useLocalSlice({
    initialState,
    slice: `Recipe ${recipeID}`,
    reducers
  })

  return (
    <form>
      <input type='text' value={formState.recipe.name} onChange={e => formDispatch.setRecipeName(e.target.value)} /> <TiTickOutline /> <TiTimesOutline /> Starter Recipe <input type='checkbox' checked={formState.recipe.isStarter} onChange={e => formDispatch.setStarterRecipe(e.target.checked)} />

      <Table className={formState.edit ? 'editing' : 'using'}>
        <tbody>
          { formState.recipe.ingredients.map((ingredient, i: number) => <IngredientRow key={ingredient.ingredientID || i} row={i} state={formState} dispatch={formDispatch} />) }
          <tr className='editing'>
            <td className='proportion'></td>
            <td className='percentage'></td>
            <td className='ingredient' colSpan={3}><button type='button' onClick={() => formDispatch.addIngredient()}><TiPlusOutline /> New ingredient</button></td>
            <td></td>
          </tr>
        </tbody>
        <Footer formState={formState} dispatch={formDispatch}/>
      </Table>
    </form>
  );
}

const Table = styled.table`
  border: 1px solid grey;
  border-collapse: collapse;

  td {
    border: 1px solid grey;
  }

`;

const getRecipe = (recipeID: number) => (state: ApplicationState) => state.recipes.map[recipeID];

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
