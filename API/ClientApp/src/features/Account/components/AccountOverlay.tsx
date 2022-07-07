import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { resetBasket } from '../../Basket/basketSlice';
import { selectUser } from '../accountSlice';
import { signOut } from '../accountThunks';

type Ref = HTMLDivElement;
type Props = {};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid #d6d6d6;
`;

const AccountMenu = styled.ul`
  li {
    padding: 10px;
  }

  li:last-of-type {
    &:hover {
      color: var(--anchor-hover-color);
      cursor: pointer;
    }
  }
`;

export default React.forwardRef<Ref, Props>(function AccountOverlay(
  props,
  ref,
): JSX.Element {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  function handleSignOut(): void {
    dispatch(signOut());
    dispatch(resetBasket());
  }

  return (
    <Overlay
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      ref={ref}
      id="account-overlay"
      {...props}
    >
      {user && (
        <AccountMenu>
          <li>
            <Link to="/account/details">Your details</Link>
          </li>
          <li>
            <Link to="/account/orders">Your orders</Link>
          </li>
          <li onClick={handleSignOut}>Sign out</li>
        </AccountMenu>
      )}
    </Overlay>
  );
});
