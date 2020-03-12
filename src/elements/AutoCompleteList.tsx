import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import usePrevious from "../utils/usePrevious";

interface AutoCompleteProps {
  autoCompleteList: string[];
  searchValue: string | string[] | number | undefined;
  onChoose: (chosenValue: string) => void;
  onActive: (isActive: boolean) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = props => {
  const {
    autoCompleteList,
    searchValue,
    onChoose,
    onActive
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const listText = useMemo(() =>
    autoCompleteList.reduce((text, item) => `${text}${item}${newLine}`, ''),
    [autoCompleteList])
  ;

  const list = useMemo(() => createFoundList(searchValue, listText), [searchValue, listText]);

  const isVisible = list !== null;
  const wasVisible = usePrevious(isVisible) ?? false;
  if (isVisible !== wasVisible) {
    onActive(isVisible);
  }

  return <div ref={containerRef}>{list}</div>;
};

export default AutoComplete;

const newLine = '\n';

const createFoundList = (searchValue: string | string[] | number | undefined, listText: string): React.ReactNode => {

  if ((typeof searchValue !== 'string') || (searchValue === '')) {
    return null;
  }

  const sanitizedSearch = sanitizeText(searchValue);
  const regexString = `^(.*)(${sanitizedSearch})(.*)$`;
  const regex = new RegExp(regexString, 'mgi');
  let resultEntries = [];
  let result;
  while ((result = regex.exec(listText))) {
    resultEntries.push(result);
  }

  if (resultEntries.length === 0) {
    return null;
  }

  if (resultEntries.length === 1
    && (resultEntries[0][0].toLowerCase() === searchValue.toLowerCase()
      || resultEntries[0][0].toLowerCase() === (searchValue.toLowerCase() + ' 🥖')
    )
  ) {
    return null;
  }

      return (
    <ul>
      { resultEntries.map(([entry, before, found, after]) => <li key={ entry }>{ before }<strong>{ found }</strong>{after}</li> ) }
    </ul>
  );
}

const sanitizeText = (text: string) => text.replace(sanitizeRegExp, '\\$1');
const sanitizeRegExp = /([\\^$.|?*+()[{])/g;

const Container = styled.div`
  position: absolute;
  z-index: 1;
`;
