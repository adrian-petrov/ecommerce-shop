import React, { ReactElement } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { resetUpdatePasswordStatus } from '../accountSlice';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import { AsyncStatus } from '../types';

const ReturningCustomer = styled.div`
  h1 {
    margin-bottom: 2rem;
  }

  p {
    margin-bottom: 1.5rem;
  }
`;

const NewCustomer = styled.div`
  h1 {
    margin-bottom: 2rem;
  }

  span {
    width: 100%;
    text-align: center;
  }
`;

export default function AuthenticationPage(): ReactElement {
  const [isCreatingNewAccount, setIsCreatingNewAccount] = React.useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const updatePasswordStatus = useAppSelector(
    (state) => state.account.updatePasswordStatus,
  );

  React.useEffect(() => {
    return () => {
      if (updatePasswordStatus === AsyncStatus.Successful) {
        dispatch(resetUpdatePasswordStatus());
      }
    };
  }, [location.pathname]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(resetUpdatePasswordStatus());
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function handleCreateNewAccount(): void {
    if (isCreatingNewAccount) {
      return;
    }
    setIsCreatingNewAccount(true);
  }

  return (
    <section>
      <Container>
        <Row>
          {updatePasswordStatus === AsyncStatus.Successful && (
            <Alert variant="success">
              Password has been changed. Please log in again using the new
              password.
            </Alert>
          )}

          {/* Returning customer */}
          <Col md={5}>
            <ReturningCustomer>
              <h1>Returning customer?</h1>
              <p>Sign in below to proceed with the order:</p>

              <SignInForm />
            </ReturningCustomer>
          </Col>
          {/* New Customer */}
          <Col md={{ span: 6, offset: 1 }}>
            <NewCustomer>
              <h1>New to our store?</h1>
              {isCreatingNewAccount ? (
                <SignUpForm />
              ) : (
                <div className="d-grid gap-2">
                  <Button
                    type="button"
                    onClick={handleCreateNewAccount}
                    className="mb-2"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </div>
              )}
            </NewCustomer>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
