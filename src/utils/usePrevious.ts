import { useRef } from "react"

const usePrevious = <T>(currentValue?: T): (T | undefined) => {
  const ref = useRef<T>();
  const previous = ref.current;
  ref.current = currentValue;
  return previous;
}

export default usePrevious;
