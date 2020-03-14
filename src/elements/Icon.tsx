import React from 'react';
import styled from 'styled-components';

interface IconProps {
  base: React.ComponentType<any>;
  height?: number;
}

const Icon: React.FC<IconProps> = ({
  base,
  height = 1.5
}) => <IconWrapper as={base} height={height}/>;

export default Icon;

const color = ({as}: IconWrapperProps) => ({
  TiTickOutline: '#093',
  TiTimesOutline: '#903',
  TiTrash: '#C30',
  TiPlusOutline: '#359',
  AiFillSchedule: '#963',
} as {[index: string]: string})[as.displayName ?? ''] ?? '#000';

const IconWrapper = styled.span`
  height: ${ ({height}: IconWrapperProps) => height }em;
  width: auto;
  vertical-align: -${ ({height}: IconWrapperProps) => height * .4 / 1.5 }em;
  color: ${color}
`;

interface IconWrapperProps {
  as: React.ComponentType<any>;
  height: number;
}
