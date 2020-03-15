import React, { useCallback, useState, useRef } from 'react';
import styled from "styled-components"
import { ComponentProps } from '../utils/types';
import AutoComplete from './AutoCompleteList';
import { DisplayFilter, SearchConverter } from './AutoCompleteList/getSearchResults';

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

  const useAutoComplete = !disabled && !!autoCompleteList.length;

  const [currentValue, setCurrentValue] = useState(value);
  if (currentValue !== value) {
    setCurrentValue(value);
  }

  const internalOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setCurrentValue(e.currentTarget.value);
    onChange(e);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const onChoose = useCallback((autoCompleteValue: string) => {
    const input = inputRef.current!;

    const proposedInputChange = {
      ...input,
      value: autoCompleteValue
    };

    const event: React.ChangeEvent<HTMLInputElement> = {
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
    }

    onChange(event);
  }, [inputRef]);

  const wrapperProps = {
    stretch,
    disabled,
    useAutoComplete,
    ...(id && { htmlFor: id })
  }

  const inputProps = {
    disabled,
    onChange: internalOnChange,
    id,
    value: currentValue,
    ref: inputRef,
    ...additionalInputProps
  };

  const autoCompleteProps = {
    autoCompleteList,
    displayFilter,
    onChoose,
    searchValue: currentValue
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
