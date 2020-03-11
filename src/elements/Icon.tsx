import React from 'react';
import styled from 'styled-components';

interface IconProps {
  base: React.ComponentType<any>;
}

const Icon: React.FC<IconProps> = ({base}) => <IconWrapper as={base}/>;

export default Icon;

const color = ({as}: {as: React.ComponentType<any>}) => ({
  TiTickOutline: '#093',
  TiTimesOutline: '#903',
  TiTrash: '#C30',
  TiPlusOutline: '#359'
} as {[index: string]: string})[as.displayName ?? ''] ?? '#000';

const IconWrapper = styled.span`
  height: 1.5em;
  width: auto;
  vertical-align: -.4em;
  color: ${color}
`;
