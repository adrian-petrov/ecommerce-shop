import { AxiosResponse } from 'axios';
import accountApi from '../../api/accountApi';
import { AppThunk } from '../../app/store';
import {
  getCurrentUserBillingAddressFulfilled,
  getCurrentUserBillingAddressPending,
  getCurrentUserBillingAddressRejected,
  getCurrentUserFulfilled,
  refreshTokenFulfilled,
  refreshTokenPending,
  refreshTokenRejected,
  signInFulfilled,
  signInPending,
  signInRejected,
  signOutFulfilled,
  signOutPending,
  signOutRejected,
  signUpFulfilled,
  signUpPending,
  signUpRejected,
  updateEmailAddressFulfilled,
  updateEmailAddressPending,
  updateEmailAddressRejected,
  updatePasswordFulfilled,
  updatePasswordPending,
  updatePasswordRejected,
  updateUserDetailsFulfilled,
  updateUserDetailsPending,
  updateUserDetailsRejected,
} from './accountActions';
import {
  TAuthenticateRequest,
  TAuthenticateResponse,
  TPasswordChangeResponse,
  TRegisterRequest,
  TServerErrorResponse,
  TUserDetailsRequest,
} from './types';

export const signIn =
  (authRequest: TAuthenticateRequest): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(signInPending());

    let response;
    try {
      response = await accountApi.authenticateAsync(authRequest);
    } catch (err) {
      dispatch(signInRejected());
      return;
    }

    if (response.status === 200) {
      dispatch(signInFulfilled(response.data));
    } else {
      dispatch(signInRejected());
    }
  };

export const signOut =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(signOutPending());

    let response;
    try {
      response = await accountApi.revokeTokenAsync();
    } catch (err) {
      dispatch(signOutRejected());
    }
    if (response?.status === 200) {
      dispatch(signOutFulfilled());
    } else {
      dispatch(signOutRejected());
    }
  };

export const signUp =
  (registerRequest: TRegisterRequest): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(signUpPending());

    let response;
    try {
      response = await accountApi.registerAsync(registerRequest);
    } catch (err) {
      dispatch(signUpRejected());
      return;
    }

    if (response.status === 200) {
      dispatch(signUpFulfilled(response.data));
    } else {
      dispatch(signInRejected());
    }
  };

export const refreshToken =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(refreshTokenPending());

    let response;

    try {
      response = await accountApi.refreshTokenAsync();
    } catch (err) {
      dispatch(refreshTokenRejected());
      return;
    }

    if (response.status === 200) {
      dispatch(refreshTokenFulfilled(response.data));
    } else {
      dispatch(refreshTokenRejected());
    }
  };

export const getCurrentUser =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    let response;

    try {
      response = await accountApi.getCurrentUserAsync();
    } catch (err) {
      return;
    }

    if (response.status === 200) {
      dispatch(getCurrentUserFulfilled(response.data));
    }
  };

export const getCurrentUserBillingAddress =
  (email: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getCurrentUserBillingAddressPending());

    let response;
    try {
      response = await accountApi.getCurrentUserBillingAddressAsync(email);
    } catch (err) {
      dispatch(getCurrentUserBillingAddressRejected());
      return;
    }
    if (response.status === 200) {
      dispatch(getCurrentUserBillingAddressFulfilled(response.data));
    }

    // billing address not set on user
    if (response.status === 204) {
      dispatch(getCurrentUserBillingAddressRejected());
    }
  };

export const updateUserDetails =
  (details: TUserDetailsRequest): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(updateUserDetailsPending());

    let response;
    try {
      response = await accountApi.updateUserDetailsAsync(details);
    } catch (err) {
      dispatch(updateUserDetailsRejected());
      return;
    }

    if (response.status === 200) {
      dispatch(updateUserDetailsFulfilled());
    }
  };

export const updateEmailAddress =
  (existingEmail: string, newEmail: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(updateEmailAddressPending());

    let response;
    try {
      response = await accountApi.updateEmailAddressAsync(
        existingEmail,
        newEmail,
      );
    } catch (err) {
      // network error
      return;
    }

    if (response.status === 200) {
      dispatch(
        updateEmailAddressFulfilled(response.data as TAuthenticateResponse),
      );
      return;
    }

    // Conflict error
    if (response.status === 409) {
      dispatch(
        updateEmailAddressRejected(response.data as TServerErrorResponse),
      );
      return;
    }

    // Other server error
    dispatch(
      updateEmailAddressRejected({ message: '' } as TServerErrorResponse),
    );
  };

export const updatePassword =
  (email: string, currentPassword: string, newPassword: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(updatePasswordPending());

    let response: AxiosResponse<TPasswordChangeResponse>;
    try {
      response = await accountApi.updatePasswordAsync(
        email,
        currentPassword,
        newPassword,
      );
    } catch (errr) {
      dispatch(updatePasswordRejected());
      return;
    }

    if (response.status === 200) {
      dispatch(updatePasswordFulfilled(response.data));
    }
  };
