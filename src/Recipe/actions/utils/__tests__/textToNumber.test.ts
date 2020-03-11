import textToNumber from "../textToNumber";

test('Number string returns number', () => {
  expect(textToNumber('10')).toEqual(10);
  expect(textToNumber('09')).toEqual(9);
  expect(textToNumber('2.5')).toEqual(2.5);
});

test('Empty string or text returns zero', () => {
  expect(textToNumber('')).toEqual(0);
  expect(textToNumber('NaN')).toEqual(0);
});
