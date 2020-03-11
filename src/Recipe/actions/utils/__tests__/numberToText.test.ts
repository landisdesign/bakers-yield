import numberToText from "../numberToText";

test('Non-zero number returns number string', () => {
  expect(numberToText(10)).toEqual('10');
  expect(numberToText(0.2)).toEqual('0.2');
  expect(numberToText(2.5)).toEqual('2.5');
});

test('Zero or NaN returns empty string', () => {
  expect(numberToText(0)).toEqual('');
  expect(numberToText(NaN)).toEqual('');
});
