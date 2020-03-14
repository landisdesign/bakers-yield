import React from 'react';
import { DispatcherMap } from 'use-local-slice';
import { TiTrash } from 'react-icons/ti';
import { AiFillSchedule } from 'react-icons/ai';

import * as reducers from './actions';
import { FormState } from '.';
import TextInput from '../elements/TextInput';
import Icon from '../elements/Icon';
import Button from '../elements/Button';
import TableCell from '../elements/TableCell';
import TableRow from '../elements/TableRow';
import { DisplayFilter } from '../elements/AutoCompleteList/getSearchResults';
import { Ingredient } from '../reducer/state';

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

  const ingredients = state.ingredients;

  return <TableRow>
    <TableCell open={edit}><TextInput stretch type='number' disabled={readonly || !edit} value={ingredient.proportion} onChange={e => dispatch.setIngredientProportion({ row, proportion: e.target.value })} /></TableCell>
    <TableCell open={!edit} align='right'>{ingredient.percentage}%</TableCell>
    <TableCell ><TextInput stretch type='text' disabled={readonly || !edit} value={ingredientText} autoCompleteList={ingredients} displayFilter={ingredientSearchFilter} onChange={e => dispatch.setIngredient({ row, name: e.target.value })} /></TableCell>
    <TableCell open={edit} align='center'><Button disabled={readonly || !edit} onClick={() => dispatch.removeIngredient(row)}><Icon base={TiTrash}/></Button></TableCell>
    <TableCell open={!edit}><TextInput stretch type='number' disabled={readonly || edit} value={ingredient.weight} onChange={e => dispatch.setIngredientWeight({ row, weight: e.target.value })} /></TableCell>
  </TableRow>;
}

export default IngredientRow;

const ingredientSearchFilter: DisplayFilter<Ingredient> = {
  search: (ingredient) => ingredient.name,
  transform: (ingredient, {before, found, after}) => <>{ before }<strong>{ found }</strong>{after}{ 'starterRecipeID' in ingredient ? <> <Icon base={AiFillSchedule} height={1} /></> : ''}</>
};
