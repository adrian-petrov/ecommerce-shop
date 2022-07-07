import { createAction } from '@reduxjs/toolkit';
import { TBillingAddress } from '../Basket/types';
import {
  TAuthenticateResponse,
  TCurrentUser,
  TPasswordChangeResponse,
  TServerErrorResponse,
} from './types';

// Sign in
export const signInPending = createAction('account/signInPending');
export const signInFulfilled = createAction<TAuthenticateResponse>(
  'account/signInFulfilled',
);
export const signInRejected = createAction('account/signInRejected');

// Sign out
export const signOutPending = createAction('account/signOutPending');
export const signOutFulfilled = createAction('account/signOutFulfilled');
export const signOutRejected = createAction('account/signOutRejected');

// Sign up
export const signUpPending = createAction('account/signUpPending');
export const signUpFulfilled = createAction<TAuthenticateResponse>(
  'account/signUpFulfilled',
);
export const signUpRejected = createAction('account/signUpRejected');

// Refresh token
export const refreshTokenPending = createAction('account/refreshTokenPending');
export const refreshTokenFulfilled = createAction<TAuthenticateResponse>(
  'account/refreshTokenFulfilled',
);
export const refreshTokenRejected = createAction(
  'account/refreshTokenRejected',
);

// Current user
export const getCurrentUserFulfilled = createAction<TCurrentUser>(
  'account/getCurrentUserFulfilled',
);

// Current user billing address
export const getCurrentUserBillingAddressPending = createAction(
  'account/getCurrentUserBillingAddressPending',
);
export const getCurrentUserBillingAddressFulfilled =
  createAction<TBillingAddress>(
    'account/getCurrentUserBillingAddressFulfilled',
  );
export const getCurrentUserBillingAddressRejected = createAction(
  'account/getCurrentUserBillingAddressRejected',
);

// Update personal details
export const updateUserDetailsPending = createAction(
  'account/updateUserDetailsPending',
);
export const updateUserDetailsFulfilled = createAction(
  'account/updateUserDetailsFulfilled',
);
export const updateUserDetailsRejected = createAction(
  'account/updateUserDetailsRejected',
);

// Update email
export const updateEmailAddressPending = createAction(
  'account/updateEmailAddressPending',
);
export const updateEmailAddressFulfilled = createAction<TAuthenticateResponse>(
  'account/updateEmailAddressFulfilled',
);
export const updateEmailAddressRejected = createAction<TServerErrorResponse>(
  'account/updateEmailAddressRejected',
);

// Update password
export const updatePasswordPending = createAction(
  'account/updatePasswordPending',
);
export const updatePasswordFulfilled = createAction<TPasswordChangeResponse>(
  'account/updatePasswordFulfilled',
);
export const updatePasswordRejected = createAction(
  'account/updatePasswordRejected',
);
