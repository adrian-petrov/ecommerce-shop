import React from 'react';
import { Link } from 'react-admin';
import styled from 'styled-components';
import logo from '../assets/logos/triangles.png';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 25x;
    height: 25px;
    align-self: align-top;
    margin-right: 5px;

    @media (max-width: 992px) {
      margin-right: 25px;
    }
  }

  h2 {
    @media (max-width: 992px) {
      display: none;
    }
  }
`;

const Logo = () => {
  return (
    <Link to="/">
      {/* Logo */}
      <LogoContainer>
        <img src={logo} alt="Main Logo" />
        <h2 className="mb-0">Ecommerce Shop</h2>
      </LogoContainer>
    </Link>
  );
};

export default Logo;
