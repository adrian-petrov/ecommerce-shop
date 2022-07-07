import React, { ReactElement } from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

const SizesContainer = styled.div`
  display: flex;

  > div:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

export default function Sizes({ children }: Props): ReactElement {
  return <SizesContainer>{children}</SizesContainer>;
}
