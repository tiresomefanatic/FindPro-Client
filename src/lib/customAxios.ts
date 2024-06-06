// customAxios.ts

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { clearAuthState } from '../redux/authSlice';
import store from '../redux/store';
import Router from 'next/router';
import { toast } from 'sonner';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const customAxios: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Set your API base URL
  withCredentials: true,
});

const retryMap = new Map<string, number>();
const MAX_REFRESH_ATTEMPTS = 5; // Maximum number of refresh token attempts

const clearAuthAndRedirect = () => {
  store.dispatch(clearAuthState());
 // Router.push('/');
};

customAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const requestUrl = originalRequest.url || '';
      console.log('refresh frontend');

      if (!retryMap.has(requestUrl)) {
        retryMap.set(requestUrl, 0); // Initialize the retry count for the request URL
      }

      const retryCount = retryMap.get(requestUrl);

      if (retryCount !== undefined && retryCount < MAX_REFRESH_ATTEMPTS) {
        retryMap.set(requestUrl, retryCount + 1); // Increment the retry count

        try {
          const response = await axios.post('http://localhost:8080/auth/refresh-token', {}, {
            withCredentials: true,
          });

          if (response.status === 200) {
            retryMap.delete(requestUrl);
            return customAxios(originalRequest);
          } else {
            console.log('Refresh token request failed with status:', response.status);
            clearAuthAndRedirect();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          clearAuthAndRedirect();
          return Promise.reject(error);
        }
      } else {
        console.log('Maximum refresh token attempts reached or retry count undefined');
        clearAuthAndRedirect();
        toast.error("Unauthorized! Please login again")
        return Promise.reject(error);
      }
    }

    clearAuthAndRedirect();
    return Promise.reject(error);
  }
);

export default customAxios;