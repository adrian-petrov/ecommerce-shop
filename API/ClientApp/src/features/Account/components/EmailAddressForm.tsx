import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import { resetUpdateEmailAddressStatus, selectUser } from '../accountSlice';
import { updateEmailAddress } from '../accountThunks';
import { AsyncStatus } from '../types';

interface IFormData {
  existingEmail: string;
  newEmail: string;
  confirmNewEmail: string;
}

export default function EmailAddressForm() {
  const user = useAppSelector(selectUser);
  const updateEmailAddressStatus = useAppSelector(
    (state) => state.account.updateEmailAddressStatus,
  );
  const updateEmailAddressError = useAppSelector(
    (state) => state.account.updateEmailAddressError,
  );
  const location = useLocation();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (updateEmailAddressStatus === AsyncStatus.Successful) {
      reset({
        existingEmail: user?.email,
        newEmail: '',
        confirmNewEmail: '',
      });

      return;
    }

    if (
      updateEmailAddressStatus === AsyncStatus.Failed &&
      updateEmailAddressError
    ) {
      setError('newEmail', {
        message: '',
      });
      setError('confirmNewEmail', {
        message: updateEmailAddressError,
      });

      return;
    }

    if (
      updateEmailAddressStatus === AsyncStatus.Failed &&
      !updateEmailAddressError
    ) {
      toast.dark('Something went wrong. Please try again later.', {
        type: 'error',
      });
    }
  }, [user, updateEmailAddressStatus]);

  React.useEffect(() => {
    return () => {
      dispatch(resetUpdateEmailAddressStatus());
    };
  }, [location.pathname]);

  const formSchema = yup.object().shape({
    existingEmail: yup.string().email().required(),
    newEmail: yup.string().email().required('This field is required'),
    confirmNewEmail: yup
      .string()
      .email()
      .oneOf([yup.ref('newEmail')], 'The emails must match'),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<IFormData>({
    mode: 'onBlur',
    defaultValues: {
      existingEmail: user?.email,
      newEmail: '',
      confirmNewEmail: '',
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(updateEmailAddress(data.existingEmail, data.newEmail));
  });

  return (
    <>
      <h2>Update Your Email Address</h2>
      <FormBase handleSubmit={onSubmit}>
        {/* Existing Email */}
        <Form.Group>
          <FloatingLabel label="Existing Email">
            <Controller
              name="existingEmail"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled
                  size="lg"
                  type="text"
                  placeholder="Existing Email"
                />
              )}
            />
          </FloatingLabel>
        </Form.Group>
        {/* New Email */}
        <Form.Group>
          <FloatingLabel label="New Email">
            <Controller
              name="newEmail"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.newEmail}
                  size="lg"
                  type="text"
                  placeholder="New Email"
                />
              )}
            />
            {errors.newEmail && (
              <Form.Control.Feedback type="invalid">
                {errors.newEmail.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        {/* Confirm New Email */}
        <Form.Group>
          <FloatingLabel label="Confirm New Email">
            <Controller
              name="confirmNewEmail"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.confirmNewEmail}
                  size="lg"
                  type="text"
                  placeholder="Confirm New Email"
                />
              )}
            />
            {errors.confirmNewEmail && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmNewEmail.message}
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
    </>
  );
}
