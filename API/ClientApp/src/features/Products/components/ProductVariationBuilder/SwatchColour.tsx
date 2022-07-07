import React, { MouseEvent, ReactElement } from 'react';
import styled from 'styled-components';

type Props = {
  value: number;
  name: string;
  handleColourChange: (e: MouseEvent<HTMLSpanElement>) => void;
  isChecked: boolean;
  isInStock: boolean;
};

const colours: { [key: string]: string } = {
  denim: '#487bab',
  navy: '#1e344a',
  grey: '#999999',
  white: '#ffffff',
  red: '#d40000',
  lightred: '#fa3232',
  lilac: '#C8A2C8',
  orange: '#fc881c',
  yellow: '#fcd01c',
  green: '#23c22d',
  black: '#000000',
  brown: '#a68f77',
  pink: '#eb8dbf',
  lightdenim: '#95b1c7',
  purple: '#702963',
  aqua: '#57fff7',
};

const SwatchColourContainer = styled.span<{
  colour: string;
  isInStock: boolean;
}>`
  position: relative;
  background-color: ${({ colour }) => colour};
  height: 3.5rem;
  width: 3.5rem;
  border: 1px solid darkgrey;
  cursor: pointer;
  border-radius: 50%;
`;

const Outline = styled.span<{ isChecked: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 4.3rem;
  width: 4.3rem;
  border-radius: 50%;
  ${({ isChecked }) => isChecked && 'border: 2px solid black;'}
`;

const SwatchColour = ({
  value,
  name,
  handleColourChange,
  isChecked,
  isInStock,
}: Props): ReactElement => {
  const normalisedString = name.replace(' ', '').toLowerCase();
  const hexCode = colours[normalisedString];

  return (
    <SwatchColourContainer
      onClick={handleColourChange}
      colour={hexCode}
      isInStock={isInStock}
      data-option-value={value}
    >
      <Outline isChecked={isChecked} />
    </SwatchColourContainer>
  );
};

export default SwatchColour;
