import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import getSearchResults from "./getSearchResults";

interface AutoCompleteProps {
  autoCompleteList: string[];
  searchValue: string | string[] | number | undefined;
  onChoose: (chosenValue: string) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = props => {
  const {
    autoCompleteList,
    searchValue,
    onChoose
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const listText = useMemo(() =>
    autoCompleteList.reduce((text, item) => `${text}${item}${newLine}`, ''),
    [autoCompleteList])
  ;

  const list = useMemo(() => getSearchResults(searchValue, listText), [searchValue, listText]);
  const listJsx = list && (
    <List>
      { list.map( ({entry, before, found, after}) => <Item key={entry}>{ before }<strong>{ found }</strong>{ after }</Item> ) }
    </List>
  );

  return <Container ref={containerRef}>{listJsx}</Container>;
};

export default AutoComplete;

const newLine = '\n';

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
`;
