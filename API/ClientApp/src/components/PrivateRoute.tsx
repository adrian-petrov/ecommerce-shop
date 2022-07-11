import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  resetRefreshTokenStatus,
  resetSignInStatus,
  selectRefreshTokenStatus,
  selectSignInStatus,
  selectSignUpStatus,
  selectUser,
} from '../features/Account/accountSlice';
import { refreshToken } from '../features/Account/accountThunks';
import { AsyncStatus } from '../features/Account/types';
import GlobalLoadingSpinner from './GlobalLoadingSpinner';

interface Props {
  isAllowed: boolean;
  children?: JSX.Element;
  redirectPath?: string;
}

export default function PrivateRoute({
  isAllowed,
  children,
  redirectPath,
}: Props) {
  const user = useAppSelector(selectUser);
  const refreshTokenStatus = useAppSelector(selectRefreshTokenStatus);
  const signInStatus = useAppSelector(selectSignInStatus);
  const signUpStatus = useAppSelector(selectSignUpStatus);
  const location = useLocation();

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (user === null) {
      dispatch(refreshToken());
    }

    return () => {
      dispatch(resetSignInStatus());
      dispatch(resetRefreshTokenStatus());
    };
  }, []);

  if (
    refreshTokenStatus === AsyncStatus.Pending ||
    signInStatus === AsyncStatus.Pending ||
    signUpStatus === AsyncStatus.Pending
  ) {
    return <GlobalLoadingSpinner />;
  }

  if (
    !isAllowed ||
    refreshTokenStatus === AsyncStatus.Failed ||
    signInStatus === AsyncStatus.Failed
  ) {
    return (
      <Navigate
        to={{
          pathname: redirectPath || '/authenticate',
        }}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children || <Outlet />;
}
