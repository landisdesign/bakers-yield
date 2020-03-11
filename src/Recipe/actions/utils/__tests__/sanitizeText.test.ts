import sanitizeText from "../sanitizeText";

test('Number string returns number', () => {
  expect(sanitizeText('10')).toEqual(10);
  expect(sanitizeText('09')).toEqual(9);
  expect(sanitizeText('2.5')).toEqual(2.5);
});

test('Empty string or text returns zero', () => {
  expect(sanitizeText('')).toEqual(0);
  expect(sanitizeText('NaN')).toEqual(0);
});
