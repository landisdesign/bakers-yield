import React from 'react';
import { DispatcherMap } from 'use-local-slice';
import { TiTrash } from 'react-icons/ti';

import * as reducers from './actions';
import { FormState } from '.';
import TextInput from '../elements/TextInput';
import Icon from '../elements/Icon';
import Button from '../elements/Button';
import TableCell from '../elements/TableCell';
import TableRow from '../elements/TableRow';

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

  const {
    edit,
    readonly
  } = state;

  const ingredient = state.recipe.ingredients[row];
  const ingredientID = ingredient.ingredientID;
  const ingredientText = typeof ingredientID === 'string'
    ? ingredientID
    : state.ingredients.find(ingredient => ingredient.id === ingredientID)?.name
  ;

  return <TableRow>
    <TableCell open={edit}><TextInput stretch type='number' disabled={!edit} value={ingredient.proportion} onChange={e => dispatch.setIngredientProportion({ row, proportion: e.target.value })} /></TableCell>
    <TableCell open={!edit} align='right'>{ingredient.percentage}%</TableCell>
    <TableCell ><TextInput stretch type='text' disabled={!edit} value={ingredientText} onChange={e => dispatch.setIngredient({ row, name: e.target.value })} /></TableCell>
    <TableCell open={edit} align='center'><Button disabled={!edit} onClick={() => dispatch.removeIngredient(row)}><Icon base={TiTrash}/></Button></TableCell>
    <TableCell open={!edit}><TextInput stretch type='number' disabled={edit} value={ingredient.weight} onChange={e => dispatch.setIngredientWeight({ row, weight: e.target.value })} /></TableCell>
  </TableRow>;
}

export default IngredientRow;
