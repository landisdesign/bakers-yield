export interface Ingredient {
  name: string;
  id: string;
  recipeCount?: number;
  starterRecipeID?: string;
}

export interface IngredientRatio {
  ingredientID: string;
  proportion: number;
}

export interface Recipe {
  name: string;
  id: string;
  isStarter: boolean;
  ingredientIDs: string[];
  totalProportion: number;
  measureByPortion: boolean;
  portionSize: number;
}

export interface Measure {
  recipeID: string;
  weights: number[];
  totalWeight: number;
  portions: number;
}
