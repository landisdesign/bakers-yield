import React from 'react';
import { DispatcherMap } from 'use-local-slice';

import * as reducers from './actions';
import IngredientRow from './IngredientRow';
import { TiTickOutline, TiTimesOutline, TiPlusOutline, TiTrash } from 'react-icons/ti';
import Footer from './Footer';
import TextInput from '../elements/TextInput';
import Checkbox from '../elements/Checkbox';
import Button from '../elements/Button';
import Icon from '../elements/Icon';
import Table from '../elements/Table';
import TableCell from '../elements/TableCell';
import TableRow from '../elements/TableRow';
import { FormState } from '.';

interface FormProps {
  formState: FormState;
  formDispatch: DispatcherMap<typeof reducers>;
}

const Form: React.FC<FormProps> = (props) => {
  const {
    formState,
    formDispatch
  } = props;

  return (
    <form>
      <div>
        <TextInput type='text' value={formState.recipe.name} onChange={e => formDispatch.setRecipeName(e.target.value)} />
        <Button onClick={() => formDispatch.setEditing(!formState.edit)}><Icon base={TiTickOutline} /></Button>
        <Button><Icon base={TiTimesOutline} /></Button>
        <Button><Icon base={TiTrash} /></Button>
      </div>
      <div>
        <Checkbox inputPosition='end' checked={formState.recipe.isStarter} onChange={e => formDispatch.setStarterRecipe(e.target.checked)}>Starter Recipe</Checkbox>
      </div>

      <Table className={formState.edit ? 'editing' : 'using'}>
        <colgroup>
          <col className='edit input' />
          <col className='use percentage' />
          <col className='ingredient' />
          <col className='edit delete' />
          <col className='use input' />
        </colgroup>
        <tbody>
          { formState.recipe.ingredients.map((ingredient, i: number) => <IngredientRow key={`${i}`} row={i} state={formState} dispatch={formDispatch} />) }
          <TableRow open={formState.edit}>
            <TableCell colSpan={2}></TableCell>
            <TableCell colSpan={3}><Button disabled={!formState.edit} onClick={() => formDispatch.addIngredient()}><Icon base={TiPlusOutline} /> New ingredient</Button></TableCell>
          </TableRow>
        </tbody>
        <thead>
          <TableRow>
            <TableCell header open={formState.edit}>Proportion</TableCell>
            <TableCell header></TableCell>
            <TableCell header>Ingredient</TableCell>
            <TableCell header></TableCell>
            <TableCell header open={!formState.edit}>Weight</TableCell>
          </TableRow>
        </thead>
        <Footer formState={formState} dispatch={formDispatch}/>
      </Table>
    </form>
  );
}

export default Form;
