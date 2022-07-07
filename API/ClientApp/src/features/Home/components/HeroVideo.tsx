import React from 'react';
import styled from 'styled-components';
import heroImage from '../../../assets/images/landing-page.jpg';

const ImageContainer = styled.div`
  background-image: url(${heroImage});
  background-repear: no-repeat;
  background-position: left center;
  background-size: cover;
  position: relative;
  height: 40vh;
  overflow: hidden;
`;

const Overlay = styled.div`
  width: 100%;
  height: 45vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #3b3b3b;
  opacity: 0.5;
`;

const HeroVideo = () => {
  return (
    <ImageContainer>
      <Overlay />
    </ImageContainer>
  );
};

export default HeroVideo;
