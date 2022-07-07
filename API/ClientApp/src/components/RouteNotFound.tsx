import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledPageNotFound = styled.section`
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const RouteNotFound = () => {
  const navigate = useNavigate();

  return (
    <StyledPageNotFound>
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div className="d-flex flex-column align-items-center text-center">
            <h1
              style={{
                fontSize: '12rem',
                fontFamily: 'monospace',
                letterSpacing: '1rem',
              }}
              className="text-danger"
            >
              404
            </h1>
            <h1 className="display-4">Page not found</h1>
            <p className="mb-5">
              We are sorry! The page you requested could not be found.
            </p>
            <Button onClick={() => navigate('/')} variant="secondary">
              Go to homepage
            </Button>
          </div>
        </div>
      </Container>
    </StyledPageNotFound>
  );
};

export default RouteNotFound;
