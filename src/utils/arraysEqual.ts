import { BinaryPredicate } from "./objectsEqual";

function arraysEqual<T>(f?: BinaryPredicate<T>): (a: T, b: T) => boolean;
function arraysEqual<T>(a: T[], b: T[], f?: BinaryPredicate<T>): boolean;

function arraysEqual<T>(a?: T[] | BinaryPredicate<T>, b?: T[], f?: BinaryPredicate<T>) {
  if (arguments.length < 2) {
    const f = a as BinaryPredicate<T> ?? ((a, b) => a === b);
    return (a: T[], b: T[]) => arraysEqual(a, b, f);
  }
  if (!a || !b) {
    return !a && !b;
  }
  if (a.length !== b.length) {
    return false;
  }
  return (a as T[]).every((x, i) => f ? f(x, b[i]) : x === b[i]);
}

export default arraysEqual;
