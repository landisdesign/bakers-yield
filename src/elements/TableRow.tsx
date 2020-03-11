import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

interface TableRowProps {
  open?: boolean;
}

const TableRow: React.FC<TableRowProps> = props => {
  const {
    open,
    children
  } = props;

  const rowRef = useRef<HTMLTableRowElement>(null);
  const [rowHeight, setRowHeight] = useState(0);

  useEffect(() => {
    if (rowRef.current) {
      const row = rowRef.current;
      let height = 0;
      for (let i = 0; i < row.children.length; i++) {
        height = Math.max(height, row.children[i].scrollHeight);
      }
      height -= +getComputedStyle(row.children[0]).paddingTop + +getComputedStyle(row.children[0]).paddingBottom;
      setRowHeight(height);
    }
  }, [rowHeight]);

  return (
    <StyledRow ref={rowRef} rowHeight={rowHeight} open={open ?? true}>{ children }</StyledRow>
  )
};

export default TableRow;

const StyledRow = styled.tr`
  & > * {
    transition-property: height, border-width, padding;
    transition-duration: .4s;
    border-bottom: 1px solid grey;
    overflow-y: hidden;
${
  ({open, rowHeight}: StyledRowProps) => open
    ? `padding: .5rem .25rem; height: ${rowHeight}px;`
    : 'padding: 0rem .25rem; height: 0; border-width: 0;'
}

    & > div {
      transition: height .4s;
      overflow-y: hidden;
      ${ ({open}: StyledRowProps) => open ? '' : 'height: 0;'}
    }
  }

  & > *:first-child,
  & > *:first-child + *:not(:last-child) {
    padding-left: .5rem;
  }

  & > *:last-child,
  & > *:not(:first-child) + *:last-child {
    padding-right: .5rem;
  }
`;

interface StyledRowProps {
  open: boolean;
  rowHeight: number;
}
