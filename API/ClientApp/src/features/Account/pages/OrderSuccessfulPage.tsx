import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { resetOrderPlacedStatus, selectLastPlacedOrder } from '../accountSlice';
import { AsyncStatus } from '../types';

interface ILocationState {
  fromCheckoutPage: boolean;
}

const SuccessMessage = styled.div`
  padding-top: 5rem;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    margin-bottom: 1rem;
  }

  a {
    font-weight: 600;
    text-decoration: underline;
  }
`;

export default function OrderSuccessfulPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fromCheckoutPage } = location.state as ILocationState;
  const orderPlacedStatus = useAppSelector(
    (state) => state.account.orderPlacedStatus,
  );
  const placedOrder = useAppSelector(selectLastPlacedOrder);
  const dispatch = useAppDispatch();

  function goToHomePage(): void {
    navigate('/');
  }

  React.useEffect(() => {
    return () => {
      dispatch(resetOrderPlacedStatus());
    };
  }, []);

  if (orderPlacedStatus === AsyncStatus.Successful && fromCheckoutPage) {
    return (
      <Container>
        <SuccessMessage>
          <AiOutlineCheckCircle color="green" size="55" />
          <h1>Thank you for your order!</h1>
          <p>
            Your order number is{' '}
            <Link to={`/account/orders/${placedOrder.id}`}>
              #{placedOrder.id}{' '}
            </Link>{' '}
          </p>
          <Button className="mt-4" size="lg" onClick={goToHomePage}>
            Continue Shopping
          </Button>
        </SuccessMessage>
      </Container>
    );
  }

  return <Navigate to="/" />;
}
