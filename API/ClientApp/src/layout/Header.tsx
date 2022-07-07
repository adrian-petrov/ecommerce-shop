import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../components/Logo';
import HeaderAccount from '../features/Account/components/HeaderAccount';
import HeaderBasket from '../features/Basket/components/HeaderBasket';
import SearchBar from '../features/Search/components/SearchBar';

const HeaderContainer = styled.header`
  position: relative;
  padding: 2.5rem 1rem 1.5rem 1rem;
`;

const HeaderMain = styled.nav`
  height: 100%;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderNavigation = styled.nav`
  margin-top: 1.8rem;

  ul {
    display: flex;
    justify-content: center;
    margin-left: 0 auto;
    font-family: 'Bebas Neue';

    & a {
      text-decoration: none;
      font-size: 1.8rem;
      text-decoration: none;
    }

    li:not(:last-of-type) {
      margin-right: 2rem;
    }

    li:hover a {
      color: var(--anchor-hover-color);
    }
  }
`;

const HeaderCustomer = styled.div`
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 1.8rem;
  }

  a {
    display: flex;
    align-items: center;

    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Container>
        <HeaderMain>
          {/* Logo */}
          <Logo />
          {/* Search bar */}
          <SearchBar />
          <div>
            <HeaderCustomer>
              <HeaderAccount />
              <HeaderBasket />
            </HeaderCustomer>
          </div>
        </HeaderMain>
        <HeaderNavigation>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </HeaderNavigation>
      </Container>
    </HeaderContainer>
  );
}
