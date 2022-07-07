import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: var(--footer-bg-color);
  font-size: 1.4rem;

  ul {
    padding: 0;

    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <section>
        <Container>
          <Row>
            {/* Women */}
            <Col sm={12} md={3}>
              <h2>Women</h2>
              <ul>
                <li>
                  <Link to="/products/women/trousers">Trousers</Link>
                </li>
                <li>
                  <Link to="/products/women/hats">Hats</Link>
                </li>
                <li>
                  <Link to="/products/women/shoes">Shoes</Link>
                </li>
                <li>
                  <Link to="/products/women/t-shirts">T-Shirts</Link>
                </li>
              </ul>
            </Col>
            {/* Men */}
            <Col sm={12} md={3}>
              <h2>Men</h2>
              <ul>
                <li>
                  <Link to="/products/men/trousers">Trousers</Link>
                </li>
                <li>
                  <Link to="/products/men/t-shirts">T-Shirts</Link>
                </li>
                <li>
                  <Link to="/products/men/hats">Hats</Link>
                </li>
                <li>
                  <Link to="/products/men/shoes">Shoes</Link>
                </li>
              </ul>
            </Col>
            <Col sm={12} md={3}>
              <h2>General</h2>
              <ul>
                <li>Contact Us</li>
                <li>Returns</li>
                <li>Privacy Policy</li>
              </ul>
            </Col>
            {/* General: About, Contact, Privacy */}
          </Row>
        </Container>
      </section>
    </StyledFooter>
  );
};

export default Footer;
