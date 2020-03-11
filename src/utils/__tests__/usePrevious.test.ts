import { renderHook } from '@testing-library/react-hooks';

import usePrevious from "../usePrevious";

test('usePrevious returns undefined until new value provided, then previous value', () => {
  let initial = 10;
  const { result, rerender } = renderHook(() => usePrevious(initial));
  expect(result.current).toBeUndefined();

  rerender();
  expect(result.current).toEqual(10);

  initial = 20;
  rerender();
  expect(result.current).toEqual(10);

  rerender();
  expect(result.current).toEqual(20);
});
