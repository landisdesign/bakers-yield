import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { DisplayFilter, SearchConverter, defaultFilter, defaultConverter, buildSearchLine, getSearchResults } from "./listFunctions";
import usePrevious from "../../utils/usePrevious";

interface AutoCompleteProps<T> {
  autoCompleteList: T[];
  displayFilter?: DisplayFilter<T> | SearchConverter<T>;
  value: string | string[] | number | undefined;
  onChoose: (chosenValue: string) => void;
  onListSizeChange: (listSize: number) => void;
  clearSelection: () => void;
  currentSelection: number;
  chosenSelection: number;
  visible: boolean;
}

type AutoCompleteListType<P extends AutoCompleteProps<any>> = P extends { autoCompleteList: (infer T)[] } ? T : never;

const AutoComplete: React.FC<AutoCompleteProps<any>> = <P extends AutoCompleteProps<any>, T = AutoCompleteListType<P>>(props: P) => {
  const {
    autoCompleteList,
    value,
    onChoose,
    onListSizeChange,
    clearSelection,
    currentSelection,
    chosenSelection,
    visible,
    displayFilter = defaultFilter
  } = props as AutoCompleteProps<T>;

  const containerRef = useRef<HTMLDivElement>(null);

  const toSearchText = typeof displayFilter === 'function' ? displayFilter : (displayFilter.search ?? defaultFilter);
  const searchToDisplay = typeof displayFilter === 'function' ? defaultConverter : (displayFilter.transform ?? defaultConverter);

  const listText = useMemo(() =>
    autoCompleteList.reduce((text, item, index) => `${text}${buildSearchLine(item, index, toSearchText)}`, ''),
    [autoCompleteList, toSearchText])
  ;

  const list = useMemo(() => visible ? getSearchResults(value, listText) : null, [value, listText, visible]);

  if (list && chosenSelection !== -1 && chosenSelection < list.length) {
    const entry = list[chosenSelection];
    onChoose(`${entry.before}${entry.found}${entry.after}`);
  }

  const currentListSize = list?.length ?? 0;
  const priorListSize = usePrevious(currentListSize) ?? 0;

  if (priorListSize !== currentListSize) {
    onListSizeChange(currentListSize);
  }

  const listJsx = visible
    ? list && (
      <List onMouseOver={() => clearSelection()}>
        { list.map( (entry, index) => {
          const item = autoCompleteList[entry.index];
          return <Item className={index === currentSelection ? 'selected' : undefined} key={entry.entry} onClick={e => { onChoose(`${entry.before}${entry.found}${entry.after}`); e.stopPropagation(); }}>{searchToDisplay(item, entry)}</Item>;
        } ) }
      </List>
    )
    : null
  ;

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
