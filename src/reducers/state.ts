export interface Ingredient {
  name: string;
  id: number;
  recipeCount?: number;
  starterRecipeID?: number;
}

export interface IngredientRatio {
  ingredientID: number;
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
