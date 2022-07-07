import React, { ReactElement } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import { selectLastPlacedOrder } from '../../Account/accountSlice';
import { resetDeliveryAddress, setDeliveryAddress } from '../basketSlice';

interface IFormData {
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}

export default function DeliveryAddressForm(): ReactElement {
  const [isUpdating, setIsUpdating] = React.useState(true);
  const lastPlacedOrder = useAppSelector(selectLastPlacedOrder);
  const currentDeliveryAddress = useAppSelector(
    (state) => state.basket.deliveryAddress,
  );
  const dispatch = useAppDispatch();
  const location = useLocation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<IFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      street1: '',
      street2: '',
      town: '',
      county: '',
      postcode: '',
    },
  });

  const values = getValues();

  React.useEffect(() => {
    if (currentDeliveryAddress) {
      setIsUpdating(false);
    }
  }, [currentDeliveryAddress]);

  React.useEffect(() => {
    if (currentDeliveryAddress) {
      setIsUpdating(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (!currentDeliveryAddress) return;

    reset({
      firstName: currentDeliveryAddress?.firstName,
      lastName: currentDeliveryAddress?.lastName,
      street1: currentDeliveryAddress?.street1,
      street2: currentDeliveryAddress?.street2,
      town: currentDeliveryAddress?.town,
      county: currentDeliveryAddress?.county,
      postcode: currentDeliveryAddress?.postcode,
    });
  }, [currentDeliveryAddress]);

  React.useEffect(() => {
    if (!lastPlacedOrder) return;

    reset({
      firstName: lastPlacedOrder.deliveryAddress.firstName,
      lastName: lastPlacedOrder.deliveryAddress.lastName,
      street1: lastPlacedOrder.deliveryAddress.street1,
      street2: lastPlacedOrder.deliveryAddress.street2,
      town: lastPlacedOrder.deliveryAddress.town,
      county: lastPlacedOrder.deliveryAddress.county,
      postcode: lastPlacedOrder.deliveryAddress.postcode,
    });
  }, [lastPlacedOrder]);

  const onSuccess: SubmitHandler<IFormData> = (data) => {
    setIsUpdating(false);
    dispatch(setDeliveryAddress(data));
  };

  const onError: SubmitErrorHandler<IFormData> = () => {};

  function handleUpdateAddress(): void {
    setIsUpdating(true);
    dispatch(resetDeliveryAddress());
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
        <span>{values.firstName + ' ' + values.lastName}</span>
        <span>{values.street1}</span>
        <span>{values.street2 && values.street2}</span>
        <span>{values.town}</span>
        <span>{values.county}</span>
        <span>{values.postcode}</span>
      </p>
      <Button variant="secondary" onClick={handleUpdateAddress}>
        Update details
      </Button>
    </div>
  );
}
