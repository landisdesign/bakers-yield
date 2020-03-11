import React from 'react';
import styled from "styled-components"
import { ComponentProps } from '../utils/types';

interface CheckboxProp {
  inputPosition?: 'start' | 'end';
}

type CheckboxProps = CheckboxProp & Omit<ComponentProps<typeof Input>, 'type'>;

const Checkbox: React.FC<CheckboxProps> = ({inputPosition = 'start', children, ...props}) => {

  const contents = inputPosition === 'start'
    ? <><Input type='checkbox' {...props} /> { children }</>
    : <>{ children } <Input type='checkbox' {...props} /></>
  ;

  return (
    'id' in props
    ? <Label inputPosition={inputPosition} checked={props.checked} htmlFor={props.id}>{ contents }</Label>
    : <Label inputPosition={inputPosition} checked={props.checked}>{ contents }</Label>
  );
}

export default Checkbox;

type LabelProp = CheckboxProp & {
  starting: boolean;
  checked?: boolean;
};

const Label = styled.label.attrs(({inputPosition = 'start'}: CheckboxProp) => ({ starting: inputPosition === 'start'}))`
  display: inline-block;
  padding: .25rem;
  margin: 0;
  cursor: pointer;

  &::${(props: LabelProp) => props.starting ? 'before' : 'after'} {
    display: inline-block;
    content: '\u2713';
    width: 1.2em;
    height: 1.2em;
    border: 1px solid #666;
    border-radius: .3125em;
    margin-${(props: LabelProp) => props.starting ? 'right' : 'left'}: .25em;
    background-color: ${(props: LabelProp) => props.checked ? '#36C' : '#FFF'};
    color: #FFF;
    font-weight: bold;
    font-size: .8em;
    line-height: 1.2em;
    vertical-align: .1em;
    text-align: center;
  }
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;
