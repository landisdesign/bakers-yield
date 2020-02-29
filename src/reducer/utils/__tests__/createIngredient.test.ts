import createIngredient from "../createIngredient";

test("createIngredient throws if it hasn't been inited", () => {
  expect(() => createIngredient('a')).toThrow();
});

test("createIngredient throws if it has been completed", () => {
  createIngredient.init(1);
  expect(() => createIngredient('a')).not.toThrow();
  createIngredient.complete();
  expect(() => createIngredient('b')).toThrow();
});

test("createIngredient returns provided ID in complete", () => {
  const expected = 1;
  createIngredient.init(expected);
  const actual = createIngredient.complete();
  expect(actual).toEqual(expected);
});

test("createIngredient creates standard ingredient and updates ID", () => {
  const expectedIngredient = {
    name: 'a',
    id: 1,
    recipeCount: 0
  };

  createIngredient.init(1);
  const actualIngredient = createIngredient(expectedIngredient.name);
  expect(actualIngredient).toEqual(expectedIngredient);

  const expectedID = 2;
  const actualID = createIngredient.complete();
  expect(actualID).toEqual(expectedID);
});

test("createIngredient creates starter recipe ingredient and updates ID", () => {
  const expectedIngredient = {
    name: 'a',
    id: 1,
    starterRecipeID: 5,
    recipeCount: 0
  };

  createIngredient.init(1);
  const actualIngredient = createIngredient(expectedIngredient.name, expectedIngredient.starterRecipeID);
  expect(actualIngredient).toEqual(expectedIngredient);

  const expectedID = 2;
  const actualID = createIngredient.complete();
  expect(actualID).toEqual(expectedID);
});

test("createIngredient creates multiple ingredients and next ID properly", () => {
  const expectedIngredients = [
    {
      name: 'a',
      id: 1,
      recipeCount: 0
    },
    {
      name: 'b',
      id: 2,
      recipeCount: 0
    },
    {
      name: 'c',
      id: 3,
      recipeCount: 0,
      starterRecipeID: 5
    },
    {
      name: 'd',
      id: 4,
      recipeCount: 0
    },
  ];

  createIngredient.init(1);
  const actualIngredients = expectedIngredients.map(ingredient => createIngredient(ingredient.name, ingredient.starterRecipeID));
  expect(actualIngredients).toEqual(expectedIngredients);

  const expectedID = expectedIngredients.length + 1;
  const actualID = createIngredient.complete();
  expect(actualID).toEqual(expectedID);
});
