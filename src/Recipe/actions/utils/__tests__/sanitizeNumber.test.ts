import sanitizeNumber from "../sanitizeNumber";

test('Non-zero number returns number string', () => {
  expect(sanitizeNumber(10)).toEqual('10');
  expect(sanitizeNumber(0.2)).toEqual('0.2');
  expect(sanitizeNumber(2.5)).toEqual('2.5');
});

test('Zero or NaN returns empty string', () => {
  expect(sanitizeNumber(0)).toEqual('');
  expect(sanitizeNumber(NaN)).toEqual('');
});
