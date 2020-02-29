export interface NumberMap<T> {
  [index: number]: T;
}

export interface MergeList {
  new: string[];
  add: number[];
  remove: number[];
}

export interface Identified {
  id: number;
}

export interface Named {
  name: string;
}
