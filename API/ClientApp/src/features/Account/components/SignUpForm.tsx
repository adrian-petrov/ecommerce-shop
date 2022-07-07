import React, { ReactElement } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import { selectSignUpStatus } from '../accountSlice';
import { signUp } from '../accountThunks';
import { AsyncStatus } from '../types';

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = (): ReactElement => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signUpStatus = useAppSelector(selectSignUpStatus);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (signUpStatus === AsyncStatus.Failed) {
      toast.dark('Something went wrong. Please try again later', {
        type: 'error',
      });
    }
  }, [signUpStatus]);

  const onSubmit = handleSubmit((data) => {
    dispatch(signUp(data));
  });

  return (
    <FormBase handleSubmit={onSubmit}>
      {/* First name */}
      <Form.Group>
        <FloatingLabel label="First Name">
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
        <FloatingLabel label="Last Name">
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

      {/* Email */}
      <Form.Group>
        <FloatingLabel label="Email Address">
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                isInvalid={!!errors.email}
                size="lg"
                type="email"
                placeholder="Email Address"
              />
            )}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>
      </Form.Group>

      {/* Password */}
      <Form.Group>
        <FloatingLabel label="Password">
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                isInvalid={!!errors.password}
                size="lg"
                type="password"
                placeholder="Password"
              />
            )}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>
      </Form.Group>

      {/* Confirm password */}
      <Form.Group>
        <FloatingLabel label="Confirm password">
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'This field is required',
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                isInvalid={!!errors.confirmPassword}
                size="lg"
                type="password"
                placeholder="Confirm password"
              />
            )}
          />
          {errors.confirmPassword && (
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword.message}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>
      </Form.Group>
      <div className="d-grid gap-2">
        <Button type="submit" className="mb-2" size="lg">
          Create Account
        </Button>
      </div>
    </FormBase>
  );
};

export default SignUpForm;
