import React from 'react';
import { DispatcherMap } from 'use-local-slice';
import { TiTrash } from 'react-icons/ti';

import * as reducers from './actions';
import { FormState } from './Form';

interface IngredientProps {
  row: number;
  state: FormState;
  dispatch: DispatcherMap<typeof reducers>;
}

const IngredientRow: React.FC<IngredientProps> = (props) => {
  const {
    row,
    state,
    dispatch
  } = props;

  const ingredient = state.recipe.ingredients[row];
  const ingredientID = ingredient.ingredientID;
  const ingredientText = typeof ingredientID === 'string'
    ? ingredientID
    : state.ingredients.find(ingredient => ingredient.id === ingredientID)?.name
  ;

  return <tr>
    <td className='proportion'><input type='number' value={ingredient.proportion} onChange={e => dispatch.setIngredientProportion({ row, proportion: e.target.value })} /></td>
    <td className='percentage'><div>{ingredient.percentage}%</div></td>
    <td className='ingredient' colSpan={2}><input type='text' value={ingredientText} onChange={e => dispatch.setIngredient({ row, name: e.target.value })} /></td>
    <td className='delete'><button type='button' onClick={e => dispatch.removeIngredient(row)}><TiTrash /></button></td>
    <td className='weight'><input type='number' value={ingredient.weight} onChange={e => dispatch.setIngredientWeight({ row, weight: e.target.value })} /></td>
  </tr>;
}

export default IngredientRow;
