import React from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectBasket,
  selectBasketItemsCount,
  selectBasketTotal,
  selectCurrentDeliveryMethod,
  selectDeliveryMethods,
  setCurrentDeliveryMethod,
} from '../basketSlice';
import { getDeliveryMethods } from '../basketThunks';
import BasketItemRow from '../components/BasketItemRow';
import { AsyncStatus } from '../types';

const BasketItemsContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;

  li:not(:last-of-type) {
    margin-bottom: 5rem;
  }
`;

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

export default function BasketPage() {
  const basket = useAppSelector(selectBasket);
  const basketItemsCount = useAppSelector(selectBasketItemsCount);
  const basketTotal = useAppSelector(selectBasketTotal);
  const deliveryMethods = useAppSelector(selectDeliveryMethods);
  const deliveryMethodsStatus = useAppSelector(
    (state) => state.basket.deliveryMethodsStatus,
  );
  const currentDeliveryMethod = useAppSelector(selectCurrentDeliveryMethod);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getDeliveryMethods());
  }, []);

  function handleDeliveryChange(
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ): void {
    dispatch(setCurrentDeliveryMethod(id));
  }

  function goToHomePage(): void {
    navigate('/');
  }

  function goToCheckout(): void {
    navigate('/checkout');
  }

  return (
    <section>
      <Container>
        <h1>Your Basket</h1>
        {!basket.length ? (
          <div>
            <p>Your shopping basket is currently empty.</p>
            <Button className="mt-4" size="lg" onClick={goToHomePage}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <Row>
            {/* Your basket */}
            <Col md={8}>
              <BasketItemsContainer>
                {basket.map((item) => (
                  <BasketItemRow
                    key={item.productVariationId}
                    basketItem={item}
                  />
                ))}
              </BasketItemsContainer>
            </Col>
            {/* Basket summary / checkout */}
            <Col md={4}>
              {deliveryMethodsStatus === AsyncStatus.Pending ? (
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
                <BasketSummary>
                  <h1>Basket Summary</h1>
                  <h2>Delivery method</h2>
                  <ul>
                    {deliveryMethods.length &&
                      deliveryMethods.map((dm, idx) => (
                        <li key={idx}>
                          <Form.Check
                            type="radio"
                            id={`${idx}-${dm.shortName}`}
                            label={`${dm.shortName} - ${
                              dm.price
                            } ${String.fromCharCode(163)}`}
                            value={dm.shortName}
                            checked={dm.isSelected}
                            onChange={(e) => handleDeliveryChange(e, dm.id)}
                          />
                        </li>
                      ))}
                  </ul>
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
                  <Button onClick={goToCheckout} className="mt-3">
                    Checkout now
                  </Button>
                </BasketSummary>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
}
