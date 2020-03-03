import createTestIngredients from "../../../../utils/testing/createTestIngredients";
import removeStarterIngredient from '../removeStarterIngredient';

test('Removing an unused starter ingredient deletes the ingredient', () => {
  let initialIngredients = createTestIngredients();
  initialIngredients[3].recipeCount = 0;

  const testRecipeID = initialIngredients[3].starterRecipeID!;
  const expected = createTestIngredients().slice(0,3);

  const actual = removeStarterIngredient(initialIngredients, testRecipeID);
  expect(actual).toEqual(expected);
});

test('Removing a used starter ingredient deletes the starter recipe reference', () => {
  const initialIngredients = createTestIngredients();

  const testRecipeID = initialIngredients[3].starterRecipeID!;
  let expected = createTestIngredients();
  delete expected[3].starterRecipeID;

  const actual = removeStarterIngredient(initialIngredients, testRecipeID);
  expect(actual).toEqual(expected);
})
