import React from 'react';
import { Alert, Button, Col, Row, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBillingAddress, selectUser } from '../accountSlice';
import { getCurrentUserBillingAddress, signOut } from '../accountThunks';
import DetailsForm from '../components/DetailsForm';
import EmailAddressForm from '../components/EmailAddressForm';
import PasswordForm from '../components/PasswordForm';
import { getCurrentUserOrders } from '../orderThunks';
import { AsyncStatus } from '../types';

const PersonalDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 2rem;
`;

const UserCredentials = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TitleBand = styled.div`
  width: 100%;
  background-color: #f7f7f7;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
`;

export default function DetailsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const orders = useAppSelector((state) => state.account.orders);
  const ordersFetchStatus = useAppSelector(
    (state) => state.account.ordersFetchStatus,
  );
  const updateUserDetailsStatus = useAppSelector(
    (state) => state.account.updateUserDetailsStatus,
  );
  const updateEmailAddressStatus = useAppSelector(
    (state) => state.account.updateEmailAddressStatus,
  );
  const billingAddress = useAppSelector(selectBillingAddress);

  // get the user orders
  React.useEffect(() => {
    if (orders.length > 0) return;

    if (!user) return;

    dispatch(getCurrentUserOrders(user.email));
  }, []);

  // get the user billing address
  React.useEffect(() => {
    if (billingAddress || user === null) return;

    dispatch(getCurrentUserBillingAddress(user.email));
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
      <Col md={9}>
        {(updateUserDetailsStatus === AsyncStatus.Successful ||
          updateEmailAddressStatus === AsyncStatus.Successful) && (
          <Alert variant="success">
            Thank you. Your details have been updated.
          </Alert>
        )}
        <TitleBand>
          <h1>Update Personal Details / Change Password</h1>
        </TitleBand>
        <div className="d-flex flex-row justify-content-around px-3">
          <PersonalDetails>
            {ordersFetchStatus === AsyncStatus.Pending ||
            ordersFetchStatus === AsyncStatus.Idle ? (
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
              <DetailsForm />
            )}
          </PersonalDetails>
          <UserCredentials>
            {!user ? (
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
              <EmailAddressForm />
            )}
            <PasswordForm />
          </UserCredentials>
        </div>
      </Col>
    </Row>
  );
}
