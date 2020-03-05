import sanitizeNumber from "../sanitizeNumber";

test('Number string returns number', () => {
  expect(sanitizeNumber('10')).toEqual(10);
  expect(sanitizeNumber('09')).toEqual(9);
  expect(sanitizeNumber('2.5')).toEqual(2.5);
});

test('Empty string or text returns zero', () => {
  expect(sanitizeNumber('')).toEqual(0);
  expect(sanitizeNumber('NaN')).toEqual(0);
});
