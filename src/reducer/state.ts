import { NumberMap, Identified, Named } from "../utils/types";
import createListAndMap from "./actions/utils/createListAndMap";

export interface ApplicationState {
  recipes: ListAndMap<Recipe>;
  ingredients: ListAndMap<Ingredient>;
  id: number;
};

export interface ListAndMap<T extends Identified> {
  list: T[];
  map: NumberMap<T>;
};

export interface Recipe extends Identified, Named {
  isStarter: boolean;
  ingredients: IngredientRatio[];
  totalWeight: number;
  totalProportion: number;
  measureByPortion: boolean;
  portionSize: number;
  portionCount: number;
}

export interface IngredientRatio {
  ingredientID: number | string;
  proportion: number;
  weight: number;
  percentage: number;
}

export interface Ingredient extends Identified, Named {
  recipeCount?: number;
  starterRecipeID?: number;
}

// Not including recipeCount prevents deletion when no longer used in recipes
export const defaultIngredientList: Ingredient[] = [
  {
    name: 'Flour',
    id: 1
  },
  {
    name: 'Water',
    id: 2
  },
  {
    name: 'Salt',
    id: 3
  },
  {
    name: 'Yeast',
    id: 4
  },
];

export const defaultIngredientRatios: IngredientRatio[] = defaultIngredientList.map(
  ingredient => ({
    ingredientID: ingredient.id,
    proportion: 0,
    weight: 0,
    percentage: 0
  })
);

export const defaultState: ApplicationState = {
  recipes: {
    list: [],
    map: {}
  },
  ingredients: createListAndMap(defaultIngredientList),
  id: 0
};
