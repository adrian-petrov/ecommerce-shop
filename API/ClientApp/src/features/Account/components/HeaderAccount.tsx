import React from 'react';
import { Overlay } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../../app/hooks';
import accountIcon from '../../../assets/icons/person.svg';
import { selectUser } from '../accountSlice';
import AccountOverlay from './AccountOverlay';

const UserIcon = styled.div`
  position: relative;
  margin-right: 12px;

  &:hover {
    cursor: pointer;
  }
`;

const SignIn = styled(Link)`
  font-size: 1.2rem;
  font-weight: 500;
  padding: 3px 3px 1px 3px;
  position: relative;
  border: 1px solid black;
  border-radius: 2px;
`;

export default function HeaderAccount(): JSX.Element {
  const [showOverlay, setShowOverlay] = React.useState(false);
  const user = useAppSelector(selectUser);
  const target = React.useRef<HTMLDivElement>(null);

  function handleShowOverlay() {
    setShowOverlay(true);
  }
  function handleHideOverlay() {
    setShowOverlay(false);
  }

  // using this only to fix a bug where the overlay
  // is showing after signing in even though it hasn't
  // been hovered over
  function handleClickOutside(event: MouseEvent): void {
    if (!target || !target.current) return;

    if (!target.current.contains(event.target as Node)) {
      handleHideOverlay();
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return user ? (
    <UserIcon
      onMouseEnter={handleShowOverlay}
      onFocus={handleShowOverlay}
      onMouseLeave={handleHideOverlay}
      onBlur={handleHideOverlay}
      ref={target}
    >
      <img src={accountIcon} alt="Account icon" />
      <Overlay target={target.current} show={showOverlay} placement="bottom">
        <AccountOverlay />
      </Overlay>
    </UserIcon>
  ) : (
    <SignIn to="/authenticate">Sign In</SignIn>
  );
}
