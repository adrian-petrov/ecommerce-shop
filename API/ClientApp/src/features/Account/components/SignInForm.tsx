import React, { ReactElement } from 'react';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import FormBase from '../../../components/FormBase';
import {
  resetSignInStatus,
  selectSignInStatus,
  selectUser,
} from '../accountSlice';
import { signIn } from '../accountThunks';
import { AsyncStatus } from '../types';

interface IFormData {
  username: string;
  password: string;
}

interface ILocationState {
  from: string;
}

export default function SignInForm(): ReactElement {
  const location = useLocation();
  const state = location.state as ILocationState;

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const signInStatus = useAppSelector(selectSignInStatus);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (signInStatus === AsyncStatus.Failed) {
      toast.dark('Username or Password is incorrect', {
        type: 'error',
      });
    }
  }, [signInStatus]);

  React.useEffect(() => {
    return () => {
      dispatch(resetSignInStatus());
    };
  }, [location.pathname]);

  const onSubmit = handleSubmit((data) => {
    dispatch(signIn(data));
  });

  if (user) {
    return <Navigate to={(state && state.from) || '/'} />;
  }

  return (
    <FormBase handleSubmit={onSubmit}>
      {/* Email */}
      <Form.Group>
        <FloatingLabel label="Email Address">
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field }) => (
              <Form.Control
                {...field}
                isInvalid={!!errors.username}
                size="lg"
                type="email"
                placeholder="Email Address"
              />
            )}
          />
          {errors.username && (
            <Form.Control.Feedback type="invalid">
              {errors.username.message}
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
      {/* If sign in unsucessful */}
      <div className="d-grid gap-1">
        <Button type="submit">Sign In</Button>
      </div>
    </FormBase>
  );
}
