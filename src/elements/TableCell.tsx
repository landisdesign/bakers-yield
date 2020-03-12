import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";

interface TableCellProps {
  open?: boolean;
  header?: boolean;
  colSpan?: number;
  align?: 'left' | 'center' | 'right';
};

const TableCell: React.FC<TableCellProps> = props => {
  const {
    header = false,
    children,
    colSpan = 1,
    align
  } = props;

  const [divHeight, setDivHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      setDivHeight(divRef.current.scrollHeight);
    }
  }, [divHeight]);

  const Cell = header ? 'th' : 'td';

  return <Cell colSpan={colSpan}><StyledDiv ref={divRef} align={align} height={divHeight}>{ children }</StyledDiv></Cell>;
};

export default TableCell;

const StyledDiv = styled.div`
  ${({align}: StyledDivProps) => align ? `text-align: ${align};` : ''}
  ${({height}: StyledDivProps) => height ? `height: ${height}px;`: ''}
`;

type StyledDivProps = Pick<TableCellProps, 'align'> & {
  height: number;
}
