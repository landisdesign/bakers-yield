import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import Form from "./Form";
import * as reducers from './actions';
import { Recipe, defaultIngredientRatios, ApplicationState, Ingredient } from '../reducer/state';
import { useSelector } from "react-redux";
import objectsEqual from "../utils/objectsEqual";
import arraysEqual from "../utils/arraysEqual";
import { numberToTextRecipe, TextRecipe } from "./actions/utils/state";
import { useLocalSlice } from "use-local-slice";
import textToNumber from "./actions/utils/textToNumber";

const RecipeForm = () => {
  const {
    recipeID = -1,
    actionOrStarterID = null,
    starterAmount = null
  } = useParams();

  const edit = recipeID === -1 || actionOrStarterID === 'edit';
  const showStarter = actionOrStarterID && actionOrStarterID !== 'edit' && starterAmount !== null;
  const readonly = !!showStarter;
  const parentRecipeID = showStarter ? +recipeID : undefined;
  const displayedRecipeID = showStarter ? +actionOrStarterID! : +recipeID;

  const ingredients = useSelector<ApplicationState, Ingredient[]>(state => state.ingredients.list, (a, b) => a.length === b.length);
  const ingredientsMap = useMemo(() => ingredients.reduce((map, ingredient) => {
    map[ingredient.name.toLowerCase()] = ingredient.id;
    return map;
  }, {} as {[index: string]: number}), [ingredients]);

  const recipe = useSelector<ApplicationState, Recipe>(getRecipe(displayedRecipeID), recipeUnchanged) || defaultRecipe;

  const initialState: FormState = {
    edit,
    readonly,
    parentRecipeID,
    ingredients,
    ingredientsMap,
    recipe: numberToTextRecipe(recipe)
  };

  const [formState, formDispatch] = useLocalSlice({
    initialState,
    slice: `Recipe ${recipe.id}`,
    reducers
  });

  if (showStarter && textToNumber(formState.recipe.totalWeight) !== +starterAmount!) {
    formDispatch.setTotalWeight(starterAmount!);
  }
  return <Form formState={formState} formDispatch={formDispatch} />;
};

export default RecipeForm;

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

export interface FormState {
  edit: boolean;
  readonly: boolean;
  recipe: TextRecipe;
  parentRecipeID?: number;
  ingredients: Ingredient[];
  ingredientsMap: { [index: string]: number};
};
