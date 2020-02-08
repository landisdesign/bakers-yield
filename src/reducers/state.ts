export interface Ingredient {
  name: string;
  id: number;
  recipeCount?: number;
  starterRecipeID?: string;
}

export interface IngredientRatio {
  ingredientID: number;
  proportion: number;
}

export interface Recipe {
  name: string;
  id: number;
  isStarter: boolean;
  ingredients: IngredientRatio[];
  totalProportion: number;
  measureByPortion: boolean;
  portionSize: number;
}

export interface Measure {
  recipeID: number;
  weights: number[];
  totalWeight: number;
  portions: number;
}

export const defaultIngredientList: Ingredient[] = [
  {
    name: 'Flour',
    id: 1,
    recipeCount: 1
  },
  {
    name: 'Water',
    id: 2,
    recipeCount: 1
  },
  {
    name: 'Salt',
    id: 3,
    recipeCount: 1
  },
  {
    name: 'Yeast',
    id: 4,
    recipeCount: 1
  },
];

export const defaultIngredientRatios: IngredientRatio[] = defaultIngredientList.map(
  ingredient => ({ingredientID: ingredient.id, proportion: 0})
);