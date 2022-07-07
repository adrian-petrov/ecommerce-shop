import React, { ReactElement } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import {
  resetBillingAddress,
  selectBillingAddress,
  selectUser,
  setBillingAddress,
} from '../../Account/accountSlice';

interface IFormData {
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}

export default function BillingAddressForm(): ReactElement {
  const [isUpdating, setIsUpdating] = React.useState(true);
  const billingAddress = useAppSelector(selectBillingAddress);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
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

  const values = getValues();

  React.useEffect(() => {
    if (billingAddress && user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        street1: billingAddress.street1,
        street2: billingAddress.street2,
        town: billingAddress.town,
        county: billingAddress.county,
        postcode: billingAddress.postcode,
      });
      setIsUpdating(false);
    }
  }, [billingAddress]);

  const onSuccess: SubmitHandler<IFormData> = (data) => {
    setIsUpdating(false);
    dispatch(setBillingAddress(data));
  };

  const onError: SubmitErrorHandler<IFormData> = () => {};

  function handleUpdateAddress(): void {
    setIsUpdating(true);
    dispatch(resetBillingAddress());
  }

  if (isUpdating) {
    return (
      <FormBase handleSubmit={handleSubmit(onSuccess, onError)}>
        {/* First name */}
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
        {/* Last name */}
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
        {/* Street 1 */}
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
        {/* Street 2 */}
        <Form.Group>
          <FloatingLabel label="Street 2">
            <Controller
              name="street2"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.street2}
                  size="lg"
                  type="text"
                  placeholder="Street 2"
                />
              )}
            />
            {errors.street2 && (
              <Form.Control.Feedback type="invalid">
                {errors.street2.message}
              </Form.Control.Feedback>
            )}
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
          <FloatingLabel label="County*">
            <Controller
              name="county"
              control={control}
              rules={{
                required: 'This field is required',
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.county}
                  size="lg"
                  type="text"
                  placeholder="County"
                />
              )}
            />
            {errors.county && (
              <Form.Control.Feedback type="invalid">
                {errors.county.message}
              </Form.Control.Feedback>
            )}
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
                  placeholder="County"
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
        <div>
          <Button type="submit">Save</Button>
        </div>
      </FormBase>
    );
  }

  return (
    <div>
      <p className="d-flex flex-column">
        <span>
          {values.firstName && values.firstName + ' ' + values.lastName}
        </span>
        <span>{values.street1 && values.street1}</span>
        <span>{values.street2 && values.street2}</span>
        <span>{values.town && values.town}</span>
        <span>{values.county && values.county}</span>
        <span> {values.postcode && values.postcode}</span>
      </p>
      <Button variant="secondary" onClick={handleUpdateAddress}>
        Update details
      </Button>
    </div>
  );
}
