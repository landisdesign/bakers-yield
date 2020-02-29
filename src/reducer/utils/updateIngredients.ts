import { Recipe, Ingredient } from "../state"
import createIngredient from "./createIngredient";
import { NumberMap, MergeList } from "../../utils/types";

function updateIngredients(merge: MergeList, ingredientsList: Ingredient[], nextID: number): [Ingredient[], number];
function updateIngredients(merge: MergeList, ingredientsList: Ingredient[], nextID: number, recipe: Recipe): [Ingredient[], number, Recipe];
function updateIngredients(merge: MergeList, ingredientsList: Ingredient[], nextID: number, recipe?: Recipe): any {

  const indexMap = ingredientsList.reduce((map, ingredient, index) => {
    map[ingredient.id] = index;
    return map;
  }, {} as NumberMap<number>);

  ingredientsList = addIngredients(ingredientsList, indexMap, merge.add);
  ingredientsList = removeIngredients(ingredientsList, indexMap, merge.remove);

  let newID;
  [ingredientsList, newID] = createIngredients(ingredientsList, nextID, merge.new);

  return recipe
   ? [ingredientsList, newID, updateRecipeIngredientIDs(recipe, ingredientsList)]
   : [ingredientsList, newID]
  ;
}

export default updateIngredients;

const addIngredients = (ingredients: Ingredient[], indexMap: NumberMap<number>, addedIDs: number[]): Ingredient[] => {

  addedIDs.forEach(id => {
    let ingredient = ingredients[indexMap[id]];
    if ('recipeCount' in ingredient) {
      ingredient.recipeCount!++;
    }
  });

  return ingredients;
};

const removeIngredients = (ingredients: Ingredient[], indexMap: NumberMap<number>, removedIDs: number[]): Ingredient[] => {

  let doomedIndices: number[] = [];
  removedIDs.forEach(id => {
    let doomedIndex = indexMap[id];
    let ingredient = ingredients[doomedIndex];
    if ('recipeCount' in ingredient && ingredient.recipeCount) {
      ingredient.recipeCount!--;
      if ( (ingredient.recipeCount === 0) && !('starterRecipeID' in ingredient)) {
        doomedIndices.push(doomedIndex);
      }
    }
  });
  doomedIndices
    .sort((a, b) => b - a) // reverse sort to remove from tail and avoid shifting indices
    .forEach(doomedIndex => {
      ingredients.splice(doomedIndex, 1);
    })
  ;

  return ingredients;
};

const createIngredients = (ingredients: Ingredient[], nextID: number, names: string[]): [Ingredient[], number] => {

  createIngredient.init(nextID);
  const newIngredients = names.map(name => {
    let newIngredient = createIngredient(name);
    newIngredient.recipeCount = 1;
    return newIngredient;
  });
  const newID = createIngredient.complete();
  Array.prototype.push.apply(ingredients, newIngredients);
  return [ingredients, newID];
};

const updateRecipeIngredientIDs = (recipe: Recipe, ingredients: Ingredient[]): Recipe => {

  recipe.ingredients.forEach(ingredientRatio => {
    if (typeof ingredientRatio.ingredientID === 'string') {
      const ingredient = ingredients.find(ingredient => ingredient.name === ingredientRatio.ingredientID);
      if (ingredient) {
        ingredientRatio.ingredientID = ingredient.id;
      }
    }
  });

  return recipe;
}
