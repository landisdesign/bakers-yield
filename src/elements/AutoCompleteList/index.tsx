import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import getSearchResults, { DisplayFilter, SearchConverter, defaultFilter, defaultConverter, buildSearchLine } from "./getSearchResults";

interface AutoCompleteProps<T> {
  autoCompleteList: T[];
  displayFilter?: DisplayFilter<T> | SearchConverter<T>;
  searchValue: string | string[] | number | undefined;
  onChoose: (chosenValue: string) => void;
}

type AutoCompleteListType<P extends AutoCompleteProps<any>> = P extends { autoCompleteList: (infer T)[] } ? T : never;

const AutoComplete: React.FC<AutoCompleteProps<any>> = <P extends AutoCompleteProps<any>, T = AutoCompleteListType<P>>(props: P) => {
  const {
    autoCompleteList,
    searchValue,
    onChoose,
    displayFilter = defaultFilter
  } = props as AutoCompleteProps<T>;

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const toSearchText = typeof displayFilter === 'function' ? displayFilter : (displayFilter.search ?? defaultFilter);
  const searchToDisplay = typeof displayFilter === 'function' ? defaultConverter : (displayFilter.transform ?? defaultConverter);

  const listText = useMemo(() =>
    autoCompleteList.reduce((text, item, index) => `${text}${buildSearchLine(item, index, toSearchText)}`, ''),
    [autoCompleteList, toSearchText])
  ;

  const list = useMemo(() => getSearchResults(searchValue, listText), [searchValue, listText]);
  const listJsx = list && (
    <List onMouseOver={() => setSelectedIndex(-1)}>
      { list.map( (entry, index) => {
        const item = autoCompleteList[entry.index];
        return <Item className={index === selectedIndex ? 'selected' : undefined} key={entry.entry} onClick={() => {onChoose(`${entry.before}${entry.found}${entry.after}`)}}>{searchToDisplay(item, entry)}</Item>;
      } ) }
    </List>
  );

  return <Container ref={containerRef}>{listJsx}</Container>;
};

export default AutoComplete;

const Container = styled.div`
  position: absolute;
  z-index: 1;
  left: -1px;
  width: calc(100% + 2px);
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  &.above > * {
    border-bottom: 0 none;
  }

  &.below > * {
    border-top: 0 none;
  }
`;

const Item = styled.li`
  padding: .5rem;
  border: 1px solid #000;
  margin: 0;
  background-color: #FFF;
  cursor: pointer;

  &:hover, &.selected {
    background-color: #DEF;
  }
`;
