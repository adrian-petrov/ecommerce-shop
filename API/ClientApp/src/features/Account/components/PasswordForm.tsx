import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import { selectUser } from '../accountSlice';
import { signOut, updatePassword } from '../accountThunks';
import { AsyncStatus } from '../types';

interface IFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function DetailsForm() {
  const user = useAppSelector(selectUser);
  const updatePasswordStatus = useAppSelector(
    (state) => state.account.updatePasswordStatus,
  );
  const updatePasswordError = useAppSelector(
    (state) => state.account.updatePasswordError,
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (updatePasswordStatus === AsyncStatus.Successful) {
      dispatch(signOut());
    }

    if (updatePasswordStatus === AsyncStatus.Failed && updatePasswordError) {
      setError('newPassword', {
        message: '',
      });
      setError('confirmNewPassword', {
        message: updatePasswordError,
      });
    }
  }, [updatePasswordStatus]);

  const formSchema = yup.object().shape({
    currentPassword: yup.string().required('This field is required'),
    newPassword: yup.string().required('This field is required'),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'The passwords must match'),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<IFormData>({
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => {
    if (!user) return;

    dispatch(
      updatePassword(user.email, data.currentPassword, data.newPassword),
    );
  });

  return (
    <>
      <h2 className="mt-5">Update Your Password</h2>
      <FormBase handleSubmit={onSubmit}>
        {/* Current Password */}
        <Form.Group>
          <FloatingLabel label="Current Password">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  size="lg"
                  type="password"
                  placeholder="Current Password"
                />
              )}
            />
          </FloatingLabel>
        </Form.Group>
        {/* New Password */}
        <Form.Group>
          <FloatingLabel label="New Password">
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.newPassword}
                  size="lg"
                  type="password"
                  placeholder="New Password"
                />
              )}
            />
            {errors.newPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.newPassword.message}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
        </Form.Group>
        {/* Confirm New Password */}
        <Form.Group>
          <FloatingLabel label="Confirm New Password">
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!errors.confirmNewPassword}
                  size="lg"
                  type="password"
                  placeholder="Confirm New Password"
                />
              )}
            />
            {errors.confirmNewPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmNewPassword.message}
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
