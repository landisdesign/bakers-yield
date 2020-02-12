import arraysEqual from '../arraysEqual';

test('Equality passes', () => {
  const testArray = [1, 2, 3];
  const result = arraysEqual(testArray, testArray);
  expect(result).toBe(true);
});

test('Both null passes', () => {
  const testNull: unknown[] = (null as unknown) as unknown[];
  const result = arraysEqual(testNull, testNull);
  expect(result).toBe(true);
});

test('One null fails', () => {
  const testNull: unknown[] = (null as unknown) as unknown[];
  const testArray: unknown[] = [];

  const result = arraysEqual(testNull, testArray);
  expect(result).toBe(false);

  const flippedResult = arraysEqual(testArray, testNull);
  expect(flippedResult).toBe(false);
});

test('Different lengths fail', () => {
  const testA = [1, 1, 1];
  const testB = [1, 1, 1, 1];

  const result = arraysEqual(testA, testB);
  expect(result).toBe(false);
});

test('Default tester passes', () => {
  const testA = [1, 2, 3];
  const testB = [ ...testA ];

  const result = arraysEqual(testA, testB);
  expect(result).toBe(true);
});

test('Default tester fails', () => {
  const testA = [1, 2, 3];
  const testB = [1, 2, 4];

  const result = arraysEqual(testA, testB);
  expect(result).toBe(false);
});

test('Custom tester passes', () => {
  const testA = [1, 2, 3];
  const testB = [1, 2, 0];

  const result = arraysEqual(testA, testB, (a, b) => a % 3 === b % 3);
  expect(result).toBe(true);
});

test('Custom tester fails', () => {
  const testA = [1, 2, 3];
  const testB = [1, 2, 1];

  const result = arraysEqual(testA, testB, (a, b) => a % 3 === b % 3);
  expect(result).toBe(false);
});

test('Curried functionality passes', () => {
  const curried = arraysEqual((a: number, b: number) => a % 3 === b % 3);

  const testA = [1, 2, 3];

  const testB = [1, 2, 0];
  const successfulResult = curried(testA, testB);
  expect(successfulResult).toBe(true);

  const testC = [1, 2, 1];
  const failedResult = curried(testA, testC);
  expect(failedResult).toBe(false);
});
