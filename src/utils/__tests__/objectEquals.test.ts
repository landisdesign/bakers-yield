import objectsEqual from '../objectsEqual';

test('Equality passes', () => {
  const testObj = {};
  const result = objectsEqual(testObj, testObj);
  expect(result).toBe(true);
});

test('Both null passes', () => {
  const testObj = null;
  const result = objectsEqual(testObj, testObj);
  expect(result).toBe(true);
});

test('One null fails', () => {
  const testNull = null;
  const testObj = {};
  const result = objectsEqual(testNull, testObj);
  expect(result).toBe(false);
});

interface TestObj {
  [index: string]: number;
}

test('Mismatched keys fail', () => {
  const testA = {
    a: 1,
    c: 3
  };
  const testB = {
    a: 1,
    b: 2,
    c: 3
  };
  const expandKeysResult = objectsEqual(testA, testB);
  expect(expandKeysResult).toBe(false);

  const contractKeysResult = objectsEqual(testB, testA);
  expect(contractKeysResult).toBe(false);

  const testC: TestObj = {
    a: 1,
    b: 2
  }
  const testD: TestObj = {
    c: 1,
    d: 2
  }
  const differentKeysResult = objectsEqual(testC, testD);
  expect(differentKeysResult).toBe(false);
});

test('Default tester passes', () => {
  const testA = {
    a: 1,
    b: 2,
    c: 3
  };
  const testB = { ...testA };
  const result = objectsEqual(testA, testB);
  expect(result).toBe(true);
});

test('Default tester fails', () => {
  const testA = {
    a: 1,
    b: 2,
    c: 3
  };
  const testB = {
    a: 1,
    b: 2,
    c: 4
  };
  const result = objectsEqual(testA, testB);
  expect(result).toBe(false);
});

test('Custom tester passes', () => {
  const testA = {
    a: 1,
    b: 'a',
    c: 3
  };
  const testB = {
    a: 1,
    b: 'x',
    c: 0
  };
  const result = objectsEqual(testA, testB, {
    b: (a, b) => a.length === b.length,
    c: (a, b) => a % 3 === b % 3
  });
  expect(result).toBe(true);
});

test('Custom tester fails', () => {
  const testA = {
    a: 1,
    b: 'a',
    c: 3
  };
  const testB = {
    a: 1,
    b: 'aa',
    c: 3
  };
  const result = objectsEqual(testA, testB, {
    b: (a, b) => a.length === b.length,
    c: (a, b) => a % 3 === b % 3
  });
  expect(result).toBe(false);
});

test('Curried tester works', () => {
  const tester = objectsEqual<TestObj>({
    a: (a, b) => a === b,
    c: (a, b) => a % 3 === b % 3
  });

  const testA = {
    a: 1,
    b: 2,
    c: 3
  };
  const testB = {
    a: 1,
    b: 2,
    c: 0
  };

  const success = tester(testA, testB);
  expect(success).toBe(true);

  const testC = {
    a: 1,
    b: 2,
    c: 4
  };

  const fail = tester(testA, testC);
  expect(fail).toBe(false);
});
