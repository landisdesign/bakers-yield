import styled from "styled-components";

const Button = styled.button.attrs(props => ({type: props.type || 'button'}))`
  background: transparent;
  border: 0 none;
  border-radius: 0;
  padding: .25rem;
  font-size: 1rem;
  cursor: pointer;
`;

export default Button;
