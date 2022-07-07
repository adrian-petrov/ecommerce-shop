import React, { ReactElement, MouseEvent } from 'react';
import styled from 'styled-components';

type Props = {
  value: number; // ProductOptionValue Id
  name: string;
  handleValueChange: (e: MouseEvent<HTMLDivElement>) => void;
  isChecked: boolean;
  isInStock: boolean;
};

const SquareBox = styled.div<{
  isChecked: boolean;
}>`
  height: 4rem;
  width: 4rem;
  border: ${({ isChecked }) =>
    isChecked ? `2px solid #0C0C0C` : '2px solid #F6F6F6'};
  display: flex;
  align-self: flex-start;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default function SizeBase({
  value,
  name,
  handleValueChange,
  isChecked,
  isInStock,
}: Props): ReactElement {
  return (
    <SquareBox
      className="swatch-size"
      onClick={handleValueChange}
      isChecked={isChecked}
      data-disabled={isInStock ? 'false' : 'true'}
      data-option-value={value}
    >
      {name}
    </SquareBox>
  );
}
