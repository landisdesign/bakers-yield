import React, { useState, useRef } from 'react';
import styled from "styled-components"
import { ComponentProps } from '../utils/types';
import AutoComplete from './AutoCompleteList';
import { DisplayFilter, SearchConverter } from './AutoCompleteList/listFunctions';
import usePrevious from '../utils/usePrevious';

interface TextInputProps<T> {
  stretch?: boolean;
  autoCompleteList?: T[];
  displayFilter?: DisplayFilter<T> | SearchConverter<T>;
}

type FullPropSet<T> = TextInputProps<T>
  & Exclude<ComponentProps<typeof Input>, 'value' | 'onChange'>
  & {
    value: Required<React.InputHTMLAttributes<HTMLInputElement>['value']>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }
;

type AutoCompleteListType<P extends FullPropSet<any>> = P extends { autoCompleteList: (infer T)[] } ? T : never;

const TextInput: React.FC<FullPropSet<any>> = <P extends FullPropSet<any>, T = AutoCompleteListType<P>>(props: P) => {
  const {
    stretch,
    disabled,
    autoCompleteList = [],
    displayFilter,
    onChange,
    value,
    id,
    ...additionalInputProps
  } = props as FullPropSet<T>;

  const inputRef = useRef<HTMLInputElement>(null);

  const useAutoComplete = !disabled && !!autoCompleteList.length;
  const [listSize, setListSize] = useState(0);
  const [currentSelection, setCurrentSelection] = useState(-1);
  const [chosenSelection, setChosenSelection] = useState(-1);

  const [autoCompleteVisibility, setAutoCompleteVisibility] = useState(true);
  const priorValue = usePrevious(value);

  if (priorValue !== value) {
    setAutoCompleteVisibility(true);
    setChosenSelection(-1);
  }

  const wrapperProps = {
    stretch,
    disabled,
    useAutoComplete,
    ...(id && { htmlFor: id })
  }

  const onKeyDown = createKeyDownEventHandler({
    listSize,
    currentSelection,
    setCurrentSelection,
    setAutoCompleteVisibility,
    setChosenSelection
  });

  const inputProps = {
    disabled,
    onKeyDown: useAutoComplete ? onKeyDown : undefined,
    onChange,
    onFocus: () => setAutoCompleteVisibility(true),
    onBlur: () => setAutoCompleteVisibility(false),
    id,
    value,
    ref: inputRef,
    ...additionalInputProps
  };

  const autoCompleteProps = {
    autoCompleteList,
    displayFilter,
    onChoose: (value: string) => onChange(createFakeChangeEvent(inputRef, value)),
    onListSizeChange: (newListSize: number) => {
      setListSize(newListSize);
      setCurrentSelection(-1);
    },
    clearSelection: () => setCurrentSelection(-1),
    value,
    currentSelection,
    chosenSelection,
    visible: autoCompleteVisibility,
    inputRef
  };

  return <InputWrapper {...wrapperProps}><Input {...inputProps} />{ useAutoComplete ? <AutoComplete { ...autoCompleteProps } /> : null}</InputWrapper>;
};

export default TextInput;

const InputWrapper = styled.label`
  transition: border-color .2s ${({disabled}: InputWrapperProps) => disabled ? '' : '.2s'};
  display: inline-block;
  box-sizing: border-box;
  ${({useAutoComplete}: InputWrapperProps) => useAutoComplete ? 'position: relative;' : ''}
  ${({stretch}: InputWrapperProps) => stretch ? 'width: 100%;' : ''}
  padding: .25rem;
  border: 1px solid ${({disabled}: InputWrapperProps) => disabled ? '#FFF' : '#666'};
  border-radius: .25rem;
  margin: 0;
  background-color: #FFF;
  cursor: text;
`;

type InputWrapperProps = Pick<TextInputProps<any>, 'stretch'> & {
  disabled?: boolean;
  useAutoComplete: boolean;
}

const Input = styled.input`
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  border: 0 none;
  padding: .25rem;
  margin: 0;
  font-size: 1rem;
  color: #000;
`;

const createFakeChangeEvent = (inputRef: React.RefObject<HTMLInputElement>, value: string): React.ChangeEvent<HTMLInputElement> => {

  const proposedInputChange = {
    ...inputRef.current!,
    value
  }

  return {
    target: proposedInputChange,
    currentTarget: proposedInputChange,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    isDefaultPrevented: () => false,
    preventDefault: () => {},
    eventPhase: Event.AT_TARGET,
    type: 'change',
    isPropagationStopped: () => false,
    stopPropagation: () => {},
    isTrusted: false,
    timeStamp: Date.now(),
    nativeEvent: new Event('change'),
    persist: () => {}
  };
};

const createKeyDownEventHandler = ({
  listSize,
  currentSelection,
  setCurrentSelection,
  setAutoCompleteVisibility,
  setChosenSelection
}: {
  listSize: number;
  currentSelection: number;
  setCurrentSelection: (value: number) => void;
  setAutoCompleteVisibility: (value: boolean) => void;
  setChosenSelection: (value: number) => void;
}) => (e: React.KeyboardEvent<HTMLInputElement>) => {

  if (listSize === 0) {
    return;
  }

  let newSelection = currentSelection;

  switch (e.key) {
    case 'Up':
    case 'ArrowUp':
      newSelection--;
      if (newSelection < 0) {
        newSelection = listSize - 1;
      }
      setCurrentSelection(newSelection);
      e.preventDefault();
      break;
    case 'Down':
    case 'ArrowDown':
      newSelection++;
      if (newSelection >= listSize) {
        newSelection = 0;
      }
      setCurrentSelection(newSelection);
      e.preventDefault();
      break;
    case 'Esc':
    case 'Escape':
      setAutoCompleteVisibility(false);
      e.preventDefault();
      break;
    case 'Enter':
      setChosenSelection(currentSelection);
      e.preventDefault();
      break;
  }
};
