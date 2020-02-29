import { Recipe } from "../state";
import { NumberMap, MergeList } from "../../utils/types";

const getIngredientChanges = (oldRecipe?: Recipe, newRecipe?: Recipe): MergeList => {

  let emptyOldIngredientIDs: NumberMap<boolean> = {};
  const oldIngredientIDs = oldRecipe
    ? oldRecipe.ingredients.reduce((idObj, ingredientRatio) => {
      idObj[ingredientRatio.ingredientID as number] = true;
      return idObj;
    }, emptyOldIngredientIDs)
    : emptyOldIngredientIDs
  ;

  let emptyNewIDs: {new: string[]; existing: number[]} = { new: [], existing: [] };
  const newIngredients = newRecipe
    ? newRecipe.ingredients.reduce((list, ingredientRatio) => {
      (list[
        typeof ingredientRatio.ingredientID === 'string' ? 'new' : 'existing'
      ] as typeof ingredientRatio.ingredientID[]).push(ingredientRatio.ingredientID);
      return list;
    }, emptyNewIDs)
    : emptyNewIDs
  ;

  const addedIngredients = newIngredients.existing.reduce((list, id) => {
    if (oldIngredientIDs[id]) {
      delete oldIngredientIDs[id];
    }
    else {
      list.push(id);
    }
    return list;
  }, [] as number[]);

  const removedIngredients = Object.keys(oldIngredientIDs).map(id => +id);

  return {
    new: newIngredients.new,
    add: addedIngredients,
    remove: removedIngredients
  }
}

export default getIngredientChanges;
