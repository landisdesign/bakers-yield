import { useRef, useEffect } from "react"

const usePrevious = <T>(currentValue?: T): (T | undefined) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = currentValue;
  }, [currentValue]);

  return ref.current;
}

export default usePrevious;
