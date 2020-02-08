import React, { useState } from 'react';
import { FormState } from './Form';
import { Ingredient } from '../reducers/state';

interface IngredientProps {
  row: number;
  state: FormState;
  ingredients: Ingredient[];
  dispatch: React.Dispatch<FormState>;
}

const IngredientRow: React.FC<IngredientProps> = (props) => {
  const {
    row,
    state
  } = props;

  const [ratio, setRatio] = useState(state.recipe.ingredients[row]?.proportion ?? 0);
  const [weight, setWeight] = useState(state.measure.weights[row] ?? 0);
  const [ingredient, setIngredient] = useState()

  return <></>;
}

export default IngredientRow;