export interface Ingredient {
  name: string;
  recipeCount?: number;
  starterRecipeID?: string;
}

export interface IngredientRatio {
  ingredient: string;
  proportion: number;
  weight: number;
  percentage: number;
}

export interface Recipe {
  name: string;
  id: number;
  isStarter: boolean;
  ingredients: IngredientRatio[];
  totalWeight: number;
  totalProportion: number;
  measureByPortion: boolean;
  portionSize: number;
  portionCount: number;
}

// Not including recipeCount prevents deletion when no longer used in recipes
export const defaultIngredientList: Ingredient[] = [
  {
    name: 'Flour'
  },
  {
    name: 'Water'
  },
  {
    name: 'Salt'
  },
  {
    name: 'Yeast'
  },
];

export const defaultIngredientRatios: IngredientRatio[] = defaultIngredientList.map(
  ingredient => ({
    ingredient: ingredient.name,
    proportion: 0,
    weight: 0,
    percentage: 0
  })
);
