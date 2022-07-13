import axios from 'axios';
import { AuthExceptions } from '../../Account/types';
import inMemoryJwtService from '../authProvider/inMemoryJwtService';

export const adminInstance = axios.create({
  baseURL: '/api/admin',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
adminInstance.interceptors.request.use((config) => {
  const token = inMemoryJwtService.token;
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Response interceptor
adminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      (error.response.data.message === AuthExceptions.ACCESS_TOKEN_NOT_FOUND ||
        error.response.data.message === AuthExceptions.ACCESS_TOKEN_INVALID) &&
      !originalRequest._retry
    ) {
      return inMemoryJwtService.getRefreshToken().then((res) => {
        inMemoryJwtService.token = res.data.accessToken;
        originalRequest._retry = true;
        return adminInstance(originalRequest);
      });
    }
    return Promise.reject(error);
  },
);
