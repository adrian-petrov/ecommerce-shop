import { Middleware } from '@reduxjs/toolkit';
import { setAccessToken } from '../api/index';
import {
  refreshTokenFulfilled,
  signInFulfilled,
} from '../features/Account/accountActions';
import { RootState } from './store';

export const saveAccessToken: Middleware<{}, RootState> =
  () => (next) => (action) => {
    if (
      (action.type === signInFulfilled.type ||
        action.type === refreshTokenFulfilled.type) &&
      action.payload !== undefined
    ) {
      setAccessToken(action.payload.accessToken);
    }
    return next(action);
  };
