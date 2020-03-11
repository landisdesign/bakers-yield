import React from 'react';
import { GiBowlingPropulsion } from 'react-icons/gi';

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

export type ComponentProps<C extends React.FC<any> | React.Component<any, any>> =
  C extends React.FC<infer P> ? P
  : C extends React.Component<infer P, any> ? P
  : never
;
