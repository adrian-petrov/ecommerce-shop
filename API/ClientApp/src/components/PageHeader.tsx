import React, { ReactElement } from 'react';
import styled from 'styled-components';
import heroImage from '../assets/images/products-page.jpg';

const HeroImage = styled.div`
  position: relative;
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 18vh;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    z-index: 100;
    color: white;
    font-size: 4rem;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 18vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #3b3b3b;
  opacity: 0.5;
`;

interface Props {
  children: React.ReactNode;
}

export default function PageHeader({ children }: Props): ReactElement {
  return (
    <HeroImage>
      {children}
      <Overlay />
    </HeroImage>
  );
}
