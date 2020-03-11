import React from 'react';
import { DispatcherMap } from "use-local-slice";

import { FormState } from ".";
import * as reducers from './actions';
import TextInput from '../elements/TextInput';
import Checkbox from '../elements/Checkbox';
import TableCell from '../elements/TableCell';
import TableRow from '../elements/TableRow';

interface FooterProps {
  formState: FormState;
  dispatch: DispatcherMap<typeof reducers>;
}

const Footer: React.FC<FooterProps> = (props) => {

  const {
    formState,
    dispatch
  } = props;

  const edit = formState.edit;
  const showPortion = formState.recipe.measureByPortion;

  return (
    <tfoot>
      <TableRow open={edit}>
        <TableCell open={edit}>{ formState.recipe.totalProportion }</TableCell>
        <TableCell open={!edit}></TableCell>
        <TableCell colSpan={3}><Checkbox disabled={!edit} inputPosition='end' checked={formState.recipe.measureByPortion} onChange={e => dispatch.setMeasureByPortion(e.target.checked)}>Measure by portion</Checkbox></TableCell>
      </TableRow>
      <TableRow open={edit}>
        <TableCell colSpan={2}></TableCell>
        <TableCell colSpan={3}><label style={{paddingLeft: '.25rem'}}>Portion size: <TextInput disabled={!edit} type='number' value={formState.recipe.portionSize} onChange={e => dispatch.setPortionSize(e.target.value)} /></label></TableCell>
      </TableRow>
      <TableRow open={!edit}>
        <TableCell header align='right' colSpan={4}>Total weight</TableCell>
        <TableCell header open={!edit}><TextInput stretch type='number' disabled={edit || showPortion} value={formState.recipe.totalWeight} onChange={e => dispatch.setTotalWeight(e.target.value)} /></TableCell>
      </TableRow>
      <TableRow open={!edit && showPortion}>
        <TableCell header align='right' colSpan={4}>Number of portions</TableCell>
        <TableCell header open={!edit}><TextInput stretch type='number' disabled={edit} value={formState.recipe.portionCount} onChange={e => dispatch.setPortionCount(e.target.value)} /></TableCell>
      </TableRow>
    </tfoot>
  );
}

export default Footer;
