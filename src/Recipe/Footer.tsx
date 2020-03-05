import React from 'react';
import { DispatcherMap } from "use-local-slice";

import { FormState } from "./Form";
import * as reducers from './actions';

interface FooterProps {
  formState: FormState;
  dispatch: DispatcherMap<typeof reducers>;
}

const Footer: React.FC<FooterProps> = (props) => {

  const {
    formState,
    dispatch
  } = props;

  return (
    <tfoot>
      <tr>
        <td className='proportion'>{ formState.recipe.totalProportion }</td>
        <td className='percentage'></td>
        <td className='ingredientName' colSpan={3}>Measure by portion <input type='checkbox' checked={formState.recipe.measureByPortion} onChange={e => dispatch.setMeasureByPortion(e.target.checked)} /></td>
        <td></td>
      </tr>
      <tr className='portionSize'>
        <td className='proportion'></td>
        <td className='percentage'></td>
        <td className='ingredientName'>Portion size</td>
        <td className='weight' colSpan={2}><input type='number' value={formState.recipe.portionSize} onChange={e => dispatch.setPortionSize(e.target.value)} /></td>
        <td></td>
      </tr>
      <tr className='portionCount'>
        <th colSpan={5}>Number of portions</th>
        <th className='weight'><input type='number' value={formState.recipe.portionCount} onChange={e => dispatch.setPortionCount(e.target.value)} /></th>
      </tr>
      <tr className='totalWeight'>
        <th colSpan={5}>Total weight</th>
        <th className='weight'><input type='number' value={formState.recipe.totalWeight} onChange={e => dispatch.setTotalWeight(e.target.value)} /></th>
      </tr>
    </tfoot>
  );
}

export default Footer;
