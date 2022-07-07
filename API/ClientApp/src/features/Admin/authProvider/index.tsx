import { AxiosResponse } from 'axios';
import { AuthProvider, UserIdentity } from 'react-admin';
import {
  TAuthenticateRequest,
  TAuthenticateResponse,
} from '../../Account/types';
import { adminInstance } from '../api';
import inMemoryJwtService from './inMemoryJwtService';

export const authProvider: AuthProvider = {
  // send username and password to the auth server and get back credentials
  login: async (params: TAuthenticateRequest) => {
    const response = await adminInstance.post<TAuthenticateResponse>(
      'account/authenticate',
      params,
    );

    if (response.status !== 200) {
      Promise.reject();
    }

    inMemoryJwtService.token = response.data.accessToken;
    Promise.resolve();
  },
  // when the dataProvider returns an error, check if this is an authentication error
  checkError: (error) => {
    if (error.status === 400 || error.status === 401) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    const token = inMemoryJwtService.token;
    if (token) return Promise.resolve();

    let newToken: AxiosResponse<TAuthenticateResponse>;
    try {
      newToken = await inMemoryJwtService.getRefreshToken();
      inMemoryJwtService.token = newToken.data.accessToken;
      return Promise.resolve();
    } catch (err) {
      // refresh token is invalid so we just reject the promise
      return Promise.reject();
    }
  },
  // remove local credentials and notify the auth server that the user logged out
  logout: async () => {
    try {
      await inMemoryJwtService.revokeToken();
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve();
    }
  },
  // get the user's profile
  getIdentity: () => {
    const userIdentity: UserIdentity = {
      id: 1,
      fullName: 'Adrian Petrov',
      avatar:
        'https://localhost:5001/Content/images/products/6-mens-neptune-shoes-2.png',
    };

    return Promise.resolve(userIdentity);
  },
  // get the user permissions (optional)
  getPermissions: () => Promise.resolve(),
  // get the user roles (optional - only for Role-Based Access Control)
  getRoles: () => Promise.resolve(),
};
