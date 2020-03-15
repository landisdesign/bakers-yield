import React from 'react';

export const getSearchResults = (searchValue: string | string[] | number | undefined, listText: string): SearchEntry[] | null => {

  if ((typeof searchValue !== 'string') || (searchValue === '')) {
    return null;
  }

  const sanitizedSearch = searchValue.replace(/([\\^$.|?*+()[{])/g, '\\$1');
  const regex = new RegExp(`^(.*)(${sanitizedSearch})(.*)${fieldSeparator}(\\d+)$`, 'mgi');

  let resultEntries: SearchEntry[] = [];
  let foundWholeText = false;
  let result;

  while ((result = regex.exec(listText))) {
    const [
      entry,
      before,
      found,
      after,
      index
    ] = result;

    foundWholeText = foundWholeText || ((before === '') && (after === ''));

    resultEntries.push({
      entry,
      before,
      found,
      after,
      index: +index
    });
  }

  if (resultEntries.length === 0) {
    return null;
  }

  if (resultEntries.length === 1 && foundWholeText) {
    return null;
  }

  return resultEntries;
}

export const buildSearchLine = function<T>(item: T, index: number, searchFilter: SearchConverter<T>) {
  return `${searchFilter(item)}${fieldSeparator}${index}${newLine}`
};

export const defaultFilter: SearchConverter<any> = (x) => '' + x;
export const defaultConverter: SearchToDisplayConverter<any> = (_, {before, found, after}) => <>{ before }<strong>{ found }</strong>{ after }</>;

const fieldSeparator = '¬~•~¬';
const newLine = '\n';

interface SearchEntry {
  entry: string;
  before: string;
  found: string;
  after: string;
  index: number;
};

export interface SearchConverter<T> {
  (item: T): string;
}

export interface SearchToDisplayConverter<T> {
  (item: T, entry: SearchEntry): React.ReactNode;
}

export interface DisplayFilter<T> {
  search?: SearchConverter<T>;
  transform?: SearchToDisplayConverter<T>;
}
