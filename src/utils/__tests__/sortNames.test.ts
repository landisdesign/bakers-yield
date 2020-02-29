import sortNames from '../sortNames';

test('Objects sorted by name regardless of case', () => {
  const testList = [
    { name: 'a' },
    { name: 'x' },
    { name: 'M' },
    { name: 'C' }
  ];

  const expected = [
    { name: 'a' },
    { name: 'C' },
    { name: 'M' },
    { name: 'x' }
  ];

  const actual = testList.sort(sortNames);
  expect(actual).toEqual(expected);
});
