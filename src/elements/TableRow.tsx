import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import usePrevious from "../utils/usePrevious";

interface TableRowProps {
  open?: boolean;
}

const TableRow: React.FC<TableRowProps> = props => {
  const {
    open = true,
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

  const wasOpen = usePrevious(open);
  useEffect(() => {
    if (wasOpen === open) {
      return;
    }

    const row = rowRef.current;
    if (!row) {
      return;
    }

    const setOverflow = makeVisible(row, open);

    if (wasOpen === undefined || open === false) {
      setOverflow();
      return;
    }

    row.addEventListener('transitionend', setOverflow);
    return () => {
      row.removeEventListener('transitionend', setOverflow);
    };

  }, [open]);

  return (
    <StyledRow ref={rowRef} rowHeight={rowHeight} open={open ?? true}>{ children }</StyledRow>
  )
};

export default TableRow;

const makeVisible = (row: HTMLTableRowElement, visible: boolean) => () => {
  const cells = row.children as HTMLCollectionOf<HTMLTableCellElement>;
  const visibility = visible ? 'visible' : 'hidden';
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    (cell.children as HTMLCollectionOf<HTMLDivElement>)[0].style.overflowY = visibility;
    cell.style.overflowY = visibility;
  }
}

const StyledRow = styled.tr`
  & > * {
    transition-property: height, border-width, padding;
    transition-duration: .4s;
    border-bottom: 1px solid grey;
${
  ({open, rowHeight}: StyledRowProps) => open
    ? `padding: .5rem .25rem; height: ${rowHeight}px;`
    : 'padding: 0rem .25rem; height: 0; border-width: 0;'
}

    & > div {
      transition: height .4s;
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
