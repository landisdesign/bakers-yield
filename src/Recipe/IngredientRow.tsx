import React from 'react';
import { FormState } from './Form';
import { DispatcherMap, ReducerMap } from 'use-local-slice';

interface IngredientProps {
  row: number;
  state: FormState;
  dispatch: DispatcherMap<any>;
}

const IngredientRow: React.FC<IngredientProps> = (props) => {
  const {
    row,
    state,
    dispatch
  } = props;

  const ingredient = state.recipe.ingredients[row];
  const ingredientID = ingredient.ingredientID;
  const ingredientText = ingredientID
    ? (ingredientID < 0 ? state.newIngredients : state.existingIngredients)
      .find(ingredient => ingredient.id === ingredientID)?.name ?? ''
    : '';

  return <tr>
    <td className='proportion'><input type='number' value={ingredient.proportion}/></td>
    <td className='percentage'><div>{ingredient.percentage}</div></td>
    <td className='ingredient'><input type='text' value={ingredientText}/></td>
    <td className='delete'>X</td>
    <td className='weight'><input type='number' value={ingredient.weight}/></td>
  </tr>;
}

export default IngredientRow;
