import axios, { AxiosResponse } from 'axios';
import {
  TAuthenticateRequest,
  TAuthenticateResponse,
  TCurrentUser,
  TPasswordChangeResponse,
  TRegisterRequest,
  TServerErrorResponse,
  TUserDetailsRequest,
  TUserDetailsResponse,
} from '../features/Account/types';
import { TBillingAddress } from '../features/Basket/types';
import { baseInstance, setAccessToken } from './index';

export default {
  authenticateAsync: async (data: TAuthenticateRequest) => {
    const response = await baseInstance.post<TAuthenticateResponse>(
      'account/authenticate',
      data,
    );
    return response;
  },
  registerAsync: async (data: TRegisterRequest): Promise<AxiosResponse> => {
    const response = await baseInstance.post<void>('account/register', data);
    return response;
  },
  revokeTokenAsync: async (): Promise<AxiosResponse> => {
    const response = await baseInstance.post<void>('account/revoke-token');
    return response;
  },
  refreshTokenAsync: async (): Promise<AxiosResponse> => {
    const response = await baseInstance.post<TAuthenticateResponse>(
      'account/refresh-token',
    );
    return response;
  },
  getCurrentUserAsync: async (): Promise<AxiosResponse> => {
    const response = await baseInstance.get<TCurrentUser>('account');
    return response;
  },
  getCurrentUserBillingAddressAsync: async (
    email: string,
  ): Promise<AxiosResponse> => {
    const response = await baseInstance.get<TBillingAddress>(
      `account/billing-address/${email}`,
    );
    return response;
  },
  updateUserDetailsAsync: async (
    data: TUserDetailsRequest,
  ): Promise<AxiosResponse> => {
    const response = await baseInstance.put<TUserDetailsResponse>(
      'account/details',
      data,
    );
    return response;
  },
  updateEmailAddressAsync: async (
    currentEmail: string,
    newEmail: string,
  ): Promise<AxiosResponse<TAuthenticateResponse | TServerErrorResponse>> => {
    let response;

    try {
      response = await baseInstance.put<TAuthenticateResponse>(
        'account/email',
        {
          currentEmail: currentEmail,
          newEmail: newEmail,
        },
      );
      setAccessToken(response.data.accessToken);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        return err.response;
      }
    }

    return response as AxiosResponse<TAuthenticateResponse>;
  },
  updatePasswordAsync: async (
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<AxiosResponse<TPasswordChangeResponse>> => {
    const response = await baseInstance.put<TPasswordChangeResponse>(
      'account/password',
      {
        email: email,
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    );
    return response;
  },
};
