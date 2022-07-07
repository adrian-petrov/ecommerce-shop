import React from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import GlobalLoadingSpinner from '../../../components/GlobalLoadingSpinner';
import { TBillingAddress } from '../../Basket/types';
import {
  resetUpdateUserDetailsStatus,
  selectBillingAddress,
  selectUser,
} from '../accountSlice';
import {
  getCurrentUserBillingAddress,
  updateUserDetails,
} from '../accountThunks';
import { AsyncStatus, TUserDetailsRequest } from '../types';

interface IFormData {
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}

export default function DetailsForm() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const updateUserDetailsStatus = useAppSelector(
    (state) => state.account.updateUserDetailsStatus,
  );
  const location = useLocation();
  const billingAddress = useAppSelector(selectBillingAddress);

  React.useEffect(() => {
    if (billingAddress !== null || user === null) return;

    dispatch(getCurrentUserBillingAddress(user.email));
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(resetUpdateUserDetailsStatus());
    };
  }, [location.pathname]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: user ? user.firstName : '',
      lastName: user ? user.lastName : '',
      street1: billingAddress ? billingAddress.street1 : '',
      street2: billingAddress ? billingAddress.street2 : '',
      town: billingAddress ? billingAddress.town : '',
      county: billingAddress ? billingAddress.county : '',
      postcode: billingAddress ? billingAddress.postcode : '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (!user) return;

    const address: TBillingAddress = {
      street1: data.street1,
      street2: data.street2,
      town: data.town,
      county: data.county,
      postcode: data.postcode,
    };

    const payload: TUserDetailsRequest = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      billingAddress: address,
    };

    dispatch(updateUserDetails(payload));
  });

  return (
    <>
      <h2>Your Details</h2>
      <FormBase handleSubmit={onSubmit}>
        {/* First Name */}
        <Form.Group>
          <FloatingLabel label="First Name*">
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.firstName}
                  size="lg"
                  type="text"
                  placeholder="First Name"
                />
              )}
            />
            {errors.firstName && (
              <Form.Control.Feedback type="invalid">
                {errors.firstName.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        {/* Last Name */}
        <Form.Group>
          <FloatingLabel label="Last Name*">
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.lastName}
                  size="lg"
                  type="text"
                  placeholder="Last Name"
                />
              )}
            />
            {errors.lastName && (
              <Form.Control.Feedback type="invalid">
                {errors.lastName.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        <h2>Billing Address</h2>
        {/* Street1 */}
        <Form.Group>
          <FloatingLabel label="Street 1*">
            <Controller
              name="street1"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.street1}
                  size="lg"
                  type="text"
                  placeholder="Street 1"
                />
              )}
            />
            {errors.street1 && (
              <Form.Control.Feedback type="invalid">
                {errors.street1.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        {/* Street2 */}
        <Form.Group>
          <FloatingLabel label="Street 2">
            <Controller
              name="street2"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  size="lg"
                  type="text"
                  placeholder="Street 2"
                />
              )}
            />
          </FloatingLabel>
        </Form.Group>
        {/* Town */}
        <Form.Group>
          <FloatingLabel label="Town*">
            <Controller
              name="town"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.town}
                  size="lg"
                  type="text"
                  placeholder="Town"
                />
              )}
            />
            {errors.town && (
              <Form.Control.Feedback type="invalid">
                {errors.town.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        {/* County */}
        <Form.Group>
          <FloatingLabel label="County">
            <Controller
              name="county"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  size="lg"
                  type="text"
                  placeholder="County"
                />
              )}
            />
          </FloatingLabel>
        </Form.Group>
        {/* Postcode */}
        <Form.Group>
          <FloatingLabel label="Postcode*">
            <Controller
              name="postcode"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.postcode}
                  size="lg"
                  type="text"
                  placeholder="Postcode"
                />
              )}
            />
            {errors.postcode && (
              <Form.Control.Feedback type="invalid">
                {errors.postcode.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        <div className="d-grid gap-1">
          <Button variant="dark" type="submit">
            Save
          </Button>
        </div>
      </FormBase>
      {updateUserDetailsStatus === AsyncStatus.Pending && (
        <GlobalLoadingSpinner />
      )}
    </>
  );
}
