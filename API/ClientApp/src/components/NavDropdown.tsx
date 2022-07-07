import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IMenuItem {
  name: string;
  to: string;
}

interface INavDropdownProps {
  name: string;
  to: string;
  menuItems: IMenuItem[];
}

interface IMenu {
  show: boolean;
}

const StyledListItem = styled.li`
  position: relative;
`;

const StyledMenuContainer = styled.div<IMenu>`
  ${({ show }) =>
    show
      ? `
    opacity: 1;
    pointer-events: all;
    transform: translateY(0);
   `
      : `
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
   `}

  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  background-color: #f9f9f9;
  width: 15rem;
  position: absolute;
  left: -1rem;
  right: 0;
  z-index: 1000;
  transition: all 0.1s ease-in;
`;

const StyledMenu = styled.ul`
  margin: 0 auto;
  padding: 0;

  & li {
    margin: 0 !important;

    & a {
      display: flex;
      flex: 1;
      padding: 1rem 1.5rem;
      font-family: 'Roboto';
      font-size: 1.4rem;
    }
  }
`;

const NavDropdown = (props: INavDropdownProps) => {
  const { name, to, menuItems } = props;
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuOpen = () => setShowMenu(true);
  const handleMenuClose = () => setShowMenu(false);

  return (
    <StyledListItem
      onMouseEnter={handleMenuOpen}
      onMouseLeave={handleMenuClose}
      onFocus={handleMenuOpen}
      onBlur={handleMenuClose}
      onClick={handleMenuClose}
    >
      <Link to={to}>{name}</Link>
      <StyledMenuContainer show={showMenu}>
        <StyledMenu>
          {menuItems.map((item, index) => (
            <li tabIndex={0} key={index}>
              <Link tabIndex={-1} to={item.to}>
                {item.name}
              </Link>
            </li>
          ))}
        </StyledMenu>
      </StyledMenuContainer>
    </StyledListItem>
  );
};

export default NavDropdown;
