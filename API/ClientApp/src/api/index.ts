import axios, { AxiosResponse } from 'axios';
import {
  AuthExceptions,
  TAuthenticateResponse,
} from '../features/Account/types';

export const baseInstance = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // to include cookies
});

// if logged in, when refreshing the page the accessToken will be erased from memory
// intercept the unauthorised requests
// to ensure that HttpContext is populated with the correct user
let refreshTokenRequest: Promise<AxiosResponse<TAuthenticateResponse>> | null;

baseInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      (error.response.data.message === AuthExceptions.ACCESS_TOKEN_NOT_FOUND ||
        error.response.data.message === AuthExceptions.ACCESS_TOKEN_INVALID) &&
      !originalRequest._retry
    ) {
      return getRefreshToken().then((res) => {
        setAccessToken(res.data.accessToken);
        originalRequest._retry = true;
        return baseInstance(originalRequest);
      });
    }
    // refresh token has expired or has been revoked
    if (
      error.response.status === 401 &&
      error.response.data.message === AuthExceptions.REFRESH_TOKEN_INVALID
    ) {
      window.location.href = '/authenticate';
    }
    return Promise.reject(error);
  },
);

function getRefreshToken(): Promise<AxiosResponse<TAuthenticateResponse>> {
  if (!refreshTokenRequest) {
    refreshTokenRequest = baseInstance.post<TAuthenticateResponse>(
      '/account/refresh-token',
    );
    refreshTokenRequest.then(
      resetRefreshTokenRequest,
      resetRefreshTokenRequest,
    );
  }
  return refreshTokenRequest;
}

function resetRefreshTokenRequest(): void {
  refreshTokenRequest = null;
}

export function setAccessToken(xtoken: string): void {
  baseInstance.defaults.headers.common['Authorization'] = `Bearer ${xtoken}`;
}
