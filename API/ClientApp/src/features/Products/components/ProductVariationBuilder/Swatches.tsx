import React, { ReactElement } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

const SwatchesContainer = styled(ButtonGroup)`
  display: flex;
  align-items: center;
  justify-context: space-between;
  height: 5rem;
  width: 100%;

  & > span:not(:last-of-type) {
    margin-right: 1.5rem;
  }
`;

export default function Swatches({ children }: Props): ReactElement {
  return <SwatchesContainer>{children}</SwatchesContainer>;
}
