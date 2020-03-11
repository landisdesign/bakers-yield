import styled from "styled-components";

export default styled.table`
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

  col {
    transition-property: width;
    transition-duration: .5s;
    width: 3rem;
  }

  col.input {
    width: 10rem;
  }

  col.ingredient {
    width: 100%;
  }

  &.using col.edit,
  &.editing col.use {
    width: 0;
  }
`;
