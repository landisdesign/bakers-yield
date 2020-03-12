import React, { useCallback, useState, useEffect } from 'react';
import styled from "styled-components"
import { ComponentProps } from '../utils/types';
import AutoComplete from './AutoCompleteList';

interface TextInputProps {
  stretch?: boolean;
  autoCompleteList?: string[];
}

const TextInput: React.FC<
  TextInputProps
  & Exclude<ComponentProps<typeof Input>, 'value' | 'onChange'>
  & {
    value: Required<React.InputHTMLAttributes<HTMLInputElement>['value']>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }
> = props => {
  const {
    stretch,
    disabled,
    autoCompleteList = [],
    onChange,
    value,
    id,
    ...additionalInputProps
  } = props;

  const useAutoComplete = !disabled && !!autoCompleteList.length;

  const [currentValue, setCurrentValue] = useState(value);
  if (currentValue !== value) {
    setCurrentValue(value);
  }

  const internalOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setCurrentValue(e.currentTarget.value);
    onChange(e);
  };

  const onChoose = useCallback((autoCompleteIndex: number) => {
    setCurrentValue(autoCompleteList![autoCompleteIndex]);
  }, [autoCompleteList]);

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
    ...additionalInputProps
  };

  const autoCompleteProps = {
    autoCompleteList,
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
  cursor: text;
`;

type InputWrapperProps = Pick<TextInputProps, 'stretch'> & {
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
