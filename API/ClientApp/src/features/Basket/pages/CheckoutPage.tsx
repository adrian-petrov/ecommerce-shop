import React, { ReactElement } from 'react';
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../Account/accountSlice';
import { getCurrentUserBillingAddress } from '../../Account/accountThunks';
import { createOrder, getCurrentUserOrders } from '../../Account/orderThunks';
import { AsyncStatus } from '../../Account/types';
import {
  selectBasketItemsCount,
  selectBasketTotal,
  selectCurrentDeliveryMethod,
} from '../basketSlice';
import { getDeliveryMethods } from '../basketThunks';
import BillingAddressForm from '../components/BillingAddressForm';
import DeliveryAddressForm from '../components/DeliveryAddressForm';

const BasketSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    margin: 2rem 0 1rem 0;
  }

  ul {
    li:not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }
`;

export default function CheckoutPage(): ReactElement {
  const basketItemsCount = useAppSelector(selectBasketItemsCount);
  const basketTotal = useAppSelector(selectBasketTotal);
  const currentDeliveryMethod = useAppSelector(selectCurrentDeliveryMethod);
  const currentDeliveryAddress = useAppSelector(
    (state) => state.basket.deliveryAddress,
  );
  const currentBillingAddress = useAppSelector(
    (state) => state.account.billingAddress,
  );
  const currentBillingAddressStatus = useAppSelector(
    (state) => state.account.billingAddressStatus,
  );
  const user = useAppSelector(selectUser);
  const orderPlacedStatus = useAppSelector(
    (state) => state.account.orderPlacedStatus,
  );
  const ordersFetchStatus = useAppSelector(
    (state) => state.account.ordersFetchStatus,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!currentDeliveryAddress && user) {
      dispatch(getCurrentUserOrders(user.email));
    }
  }, []);

  React.useEffect(() => {
    if (!currentDeliveryMethod) {
      dispatch(getDeliveryMethods());
    }
  }, []);

  function handleCreateOrder(): void {
    if (
      currentDeliveryAddress === null ||
      currentDeliveryMethod === undefined ||
      currentBillingAddress === null
    )
      return;

    dispatch(
      createOrder(
        currentDeliveryAddress,
        currentBillingAddress,
        currentDeliveryMethod.id,
      ),
    );
  }

  function goToPaymentPage(): void {
    navigate('payment');
  }

  if (orderPlacedStatus === AsyncStatus.Successful) {
    return (
      <Navigate
        to={{
          pathname: '/order-successful',
        }}
        state={{
          fromCheckoutPage: true,
        }}
      />
    );
  }

  function fetchBillingAddress(): void {
    if (!user || currentBillingAddress) return;

    dispatch(getCurrentUserBillingAddress(user.email));
  }

  if (basketItemsCount === 0) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <Routes>
        {/* /checkout */}
        <Route
          index
          element={
            <Row>
              <h1 className="mb-4">Delivery address</h1>
              <Col md={{ span: 7 }}>
                {ordersFetchStatus === AsyncStatus.Pending ? (
                  <Spinner
                    style={{
                      margin: 'auto',
                      width: '3rem',
                      height: '3rem',
                      borderWidth: '4px',
                    }}
                    animation="border"
                    role="status"
                  />
                ) : (
                  <DeliveryAddressForm />
                )}
              </Col>
              {/* Basket summary / checkout */}
              <Col md={{ span: 4, offset: 1 }}>
                <BasketSummary>
                  <h1>Basket Summary</h1>
                  {/* Totals */}
                  <div className="mt-4">
                    <Table>
                      <tbody>
                        <tr>
                          <td>Items Total ({basketItemsCount}):</td>
                          <td>&#163;{basketTotal}</td>
                        </tr>
                        <tr>
                          <td>Delivery:</td>
                          <td>&#163;{currentDeliveryMethod?.price}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Order Total</strong>
                          </td>
                          <td>
                            &#163;
                            {currentDeliveryMethod &&
                              (
                                +basketTotal + currentDeliveryMethod.price
                              ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <Button
                    onClick={goToPaymentPage}
                    onMouseOver={fetchBillingAddress}
                    disabled={!currentDeliveryAddress}
                    className="mt-3"
                  >
                    Go to payment
                  </Button>
                </BasketSummary>
              </Col>
            </Row>
          }
        />
        {/* /checkout/payment */}
        <Route
          path="payment"
          element={
            <Row>
              <h1 className="mb-4">Billing address</h1>
              <Col md={{ span: 7 }}>
                {currentBillingAddressStatus === AsyncStatus.Pending ? (
                  <Spinner
                    style={{
                      margin: 'auto',
                      width: '3rem',
                      height: '3rem',
                      borderWidth: '4px',
                    }}
                    animation="border"
                    role="status"
                  />
                ) : (
                  <BillingAddressForm />
                )}
              </Col>
              {/* Basket summary / checkout */}
              <Col md={{ span: 4, offset: 1 }}>
                <BasketSummary>
                  <h1>Basket Summary</h1>
                  {/* Totals */}
                  <div className="mt-4">
                    <Table>
                      <tbody>
                        <tr>
                          <td>Items Total ({basketItemsCount}):</td>
                          <td>&#163;{basketTotal}</td>
                        </tr>
                        <tr>
                          <td>Delivery:</td>
                          <td>&#163;{currentDeliveryMethod?.price}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Order Total</strong>
                          </td>
                          <td>
                            &#163;
                            {currentDeliveryMethod &&
                              (
                                +basketTotal + currentDeliveryMethod.price
                              ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <Button
                    onClick={handleCreateOrder}
                    disabled={!currentBillingAddress}
                    className="mt-3"
                  >
                    Place order
                  </Button>
                </BasketSummary>
              </Col>
            </Row>
          }
        />
      </Routes>
    </Container>
  );
}
