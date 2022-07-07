import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { resetCurrentUserOrder } from '../accountSlice';
import { TCurrentUserOrder } from '../types';

const TitleBand = styled.div`
  width: 100%;
  background-color: #f7f7f7;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`;

const SingleOrderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function SingleOrderPage() {
  const [order, setOrder] = React.useState<TCurrentUserOrder | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserOrders = useAppSelector((state) => state.account.orders);

  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const existingOrder = currentUserOrders.find((x) => x.id === id);

    if (existingOrder) {
      setOrder(existingOrder);
    }
  }, [currentUserOrders]);

  React.useEffect(() => {
    return () => {
      dispatch(resetCurrentUserOrder());
    };
  }, [location.pathname]);

  function goBack(): void {
    navigate(-1);
  }

  return (
    <SingleOrderContainer>
      <TitleBand>
        <h1>Order #{order?.id}</h1>
      </TitleBand>
      <OrderBody>
        <div className="d-flex justify-content-between">
          <Col md={6}>
            <table className="table">
              <tbody>
                <tr>
                  <h2>Summary</h2>
                </tr>
                <tr>
                  <th scope="row">Order Status</th>
                  <td>{order?.status}</td>
                </tr>
                <tr>
                  <th scope="row">Order Date</th>
                  <td>{order?.orderDate}</td>
                </tr>
                <tr>
                  <th scope="row">Delivery Method</th>
                  <td>{order?.deliveryMethod}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col
            md={{
              span: 5,
              offset: 1,
            }}
          >
            {/* Delivery Address */}
            <div>
              <h2>Delivery Address</h2>
              <address>
                {order?.deliveryAddress.firstName}{' '}
                {order?.deliveryAddress.lastName}
                <br />
                {order?.deliveryAddress.street1}
                <br />
                {order?.deliveryAddress.street2 &&
                  order?.deliveryAddress.street2}
                {order?.deliveryAddress.street2 && <br />}
                {order?.deliveryAddress.town}
                <br />
                {order?.deliveryAddress.postcode}
              </address>
            </div>
          </Col>
        </div>
        <OrderItems>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Variant</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems.map((oi) => (
                <tr key={oi.productVariationId}>
                  <td>{oi.productName}</td>
                  <td>{oi.productVariationString.replace(/_/g, ' ')}</td>
                  <td>&#163;{oi.price}</td>
                  <td>{oi.quantity}</td>
                  <td>&#163;{Number(oi.price * oi.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-50 table align-self-end mt-4">
            <tbody>
              <tr>
                <th scope="row">Subtotal</th>
                <td>&#163;{order?.total}</td>
              </tr>
              <tr>
                <th scope="row">Delivery</th>
                <td>&#163;{order?.shippingPrice}</td>
              </tr>
              <tr>
                <th scope="row">Total</th>
                <td>
                  &#163;
                  {order &&
                    Number(order.total + order?.shippingPrice).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </OrderItems>
      </OrderBody>
      <Button
        variant="dark"
        size="lg"
        className="align-self-start"
        onClick={goBack}
      >
        Back
      </Button>
    </SingleOrderContainer>
  );
}
