import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import featuredStories1 from '../../../assets/images/featured-stories-1.jpg';
import featuredStories2 from '../../../assets/images/featured-stories-2.jpg';
import featuredStories3 from '../../../assets/images/featured-stories-3.jpg';

const StyledRow = styled(Row)`
  padding-top: 3rem;

  @media (max-width: 768px) {
    div:not(:last-of-type) {
      margin-bottom: 4rem;
    }
  }
`;

const BaseStoryCard = styled(Link)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 25rem;

  &:hover > div {
    opacity: 0.6;
  }

  &:hover > h2 {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const Overlay = styled.div`
  position: absolute:
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: #2e2e2e;
  transition: all 0.3s ease-in;
`;

const FeatureText = styled.h2`
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -10%);
  color: white;
  opacity: 0;
  transition: all 0.3s ease-in;
`;

const FirstFeaturedStory = styled(BaseStoryCard)`
  background-image: url(${featuredStories1});
`;

const SecondFeaturedStory = styled(BaseStoryCard)`
  background-image: url(${featuredStories2});
`;

const ThirdFeaturedStory = styled(BaseStoryCard)`
  background-image: url(${featuredStories3});
`;

const FeaturedStories = () => {
  return (
    <section>
      <Container>
        <h1 style={{ textAlign: 'center' }}>Featured Stories</h1>
        <StyledRow xs={1} md={3}>
          <Col>
            <FirstFeaturedStory
              to="/stories/adventures-with-robin"
              state={{
                story: 'Robin',
              }}
            >
              <Overlay />
              <FeatureText>Adventures with Robin</FeatureText>
            </FirstFeaturedStory>
          </Col>
          <Col>
            <SecondFeaturedStory
              to="/stories/somerset-hills"
              state={{
                story: 'Somerset',
              }}
            >
              <Overlay />
              <FeatureText>Somerset Hills</FeatureText>
            </SecondFeaturedStory>
          </Col>
          <Col>
            <ThirdFeaturedStory
              to="/stories/touring-with-lucy-around-europe"
              state={{
                story: 'Lucy',
              }}
            >
              <Overlay />
              <FeatureText>Touring with Lucy around Europe</FeatureText>
            </ThirdFeaturedStory>
          </Col>
        </StyledRow>
      </Container>
    </section>
  );
};

export default FeaturedStories;
