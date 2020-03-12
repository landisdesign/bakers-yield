import React, { useCallback, useState } from 'react';
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

  const [isVisible, setVisible] = useState(false);

  const onActive = (visible: boolean) => {
  console.log(visible);
    setVisible(visible);
  }

  const internalOnChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setCurrentValue(e.currentTarget.value);
    onChange(e);
  };

  const onChoose = useCallback((autoCompleteValue: string) => {
    setCurrentValue(autoCompleteValue);
  }, [autoCompleteList]);

  const wrapperProps = {
    stretch,
    disabled,
    useAutoComplete,
    isVisible,
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
    onActive,
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
  ${({isVisible}: InputWrapperProps) => isVisible ? 'z-index: 1; box-shadow: 0 0 .5rem -.25rem #000, 0 .25rem .5rem -.25rem rgba(0, 0, 0, 1);' : ''}
  ${({stretch}: InputWrapperProps) => stretch ? 'width: 100%;' : ''}
  padding: .25rem;
  border: 1px solid ${({disabled}: InputWrapperProps) => disabled ? '#FFF' : '#666'};
  border-radius: .25rem;
  margin: 0;
  background-color: #FFF;
  cursor: text;
`;

type InputWrapperProps = Pick<TextInputProps, 'stretch'> & {
  disabled?: boolean;
  useAutoComplete: boolean;
  isVisible: boolean;
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
