import createTestFormState from "../../../utils/testing/createTestFormState";
import addIngredient from "../addIngredient";

test('Empty ingredient added to recipe', () => {
  const initialState = createTestFormState();
  let ingredients = [...initialState.recipe.ingredients];
  ingredients.push({
    ingredientID: '',
    weight: 0,
    proportion: 0,
    percentage: 0
  });

  const expected = {
    ...initialState,
    recipe: {
      ...initialState.recipe,
      ingredients
    }
  };

  const actual = addIngredient(initialState);
  expect(actual).toEqual(expected);
});
