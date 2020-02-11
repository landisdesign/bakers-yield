function objectsEqual<T>(f?: Partial<BinaryPredicateMap<T>>): (a: T, b: T) => boolean;
function objectsEqual<T>(a: T, b:T, f: Partial<BinaryPredicateMap<T>>): boolean;

function objectsEqual<T>(a?: T | Partial<BinaryPredicateMap<T>>, b?: T, f?: Partial<BinaryPredicateMap<T>>) {
  if (arguments.length < 2) {
    const f = a as Partial<BinaryPredicateMap<T>> ?? {};
    return (a: T, b: T) => objectsEqual(a, b, f);
  }
  if (a && b && f) {
    return (Object.keys(a) as (keyof T)[]).every(key => key in f ? f[key]!((a as T)[key], b[key]) : a[key] === b[key]);
  }
  return !a && !b;
}

export type BinaryPredicate<V> = (a: V, b: V) => boolean;

type BinaryPredicateMap<T> = {
  [P in keyof T]: BinaryPredicate<T[P]>;
}

export default objectsEqual;
