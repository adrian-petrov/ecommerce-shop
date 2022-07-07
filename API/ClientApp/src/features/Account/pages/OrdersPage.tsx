import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../accountSlice';
import { signOut } from '../accountThunks';
import { getCurrentUserOrders } from '../orderThunks';
import SingleOrderPage from './SingleOrderPage';

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderContainer = styled.div`
  width: 100%;
  padding: 1rem;
  border: 1px solid #f7f7f7;
  display: flex;
  justify-content: flex-start;
  box-shadow: 0 0 6px #eee;

  &:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 8rem;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderItem = styled.div`
  min-height: 10rem;
  display: flex;
  justify-content: flex-start;

  img {
    margin-right: 3rem;
    max-width: 8rem;
  }
`;

const TitleBand = styled.div`
  width: 100%;
  background-color: #f7f7f7;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`;

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const orders = useAppSelector((state) => state.account.orders);

  React.useEffect(() => {
    if (!user) return;

    dispatch(getCurrentUserOrders(user.email));
  }, []);

  function handleSignOut(): void {
    dispatch(signOut());
  }

  return (
    <Row>
      <Col md={3}>
        <h1>Hi {user?.firstName}, Welcome Back</h1>
        <Button variant="dark" className="mb-4" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Col>
      {/* Right column contains both routes */}
      <Col md={9}>
        <Routes>
          <Route
            index
            element={
              <OrdersContainer>
                <TitleBand>
                  <h1>Orders History and Tracking</h1>
                </TitleBand>
                {orders &&
                  orders.map((order) => (
                    <OrderContainer key={order.id}>
                      {/* Details */}
                      <OrderDetails>
                        <h3>Order No: {order.id}</h3>
                        <span>Order Placed: {order.orderDate}</span>
                        <span>
                          <strong>
                            Total{' '}
                            {Number(order.total + order.shippingPrice).toFixed(
                              2,
                            )}
                            &#163;
                          </strong>
                        </span>
                        <span className="mt-4">
                          <Link
                            className="text-uppercase text-decoration-underline"
                            to={`${order.id}`}
                          >
                            View Your Order
                          </Link>
                        </span>
                      </OrderDetails>
                      {/* Order status & Product Image */}
                      <OrderItems>
                        <h3>{order.status}</h3>
                        {order.orderItems.map((oi) => (
                          <OrderItem key={oi.productVariationId}>
                            <img src={oi.pictureUrl} alt="Order Item" />
                            <div className="d-flex flex-column justify-content-start">
                              <span>
                                <strong>{oi.productName}</strong>
                              </span>
                              <span>X {oi.quantity}</span>
                            </div>
                          </OrderItem>
                        ))}
                      </OrderItems>
                    </OrderContainer>
                  ))}
              </OrdersContainer>
            }
          />
          <Route path=":id" element={<SingleOrderPage />} />
        </Routes>
      </Col>
    </Row>
  );
}
