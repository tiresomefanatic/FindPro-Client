import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { clearAuthState, setAccessToken } from '../redux/authSlice';
import store from '../redux/store';
import Router from 'next/router';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const customAxios: AxiosInstance = axios.create({
  baseURL: baseURL,
});

const MAX_REFRESH_ATTEMPTS = 5;
const retryMap = new Map<string, number>();

const clearAuthAndRedirect = () => {
  store.dispatch(clearAuthState());
  Router.push('/login');
};

// Request interceptor
customAxios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    
    if (!accessToken) {
      // If there's no access token, throw an error
      throw new Error('No access token available');
    }

    // Always set the Authorization header
    config.headers['Authorization'] = `Bearer ${accessToken}`;

    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
customAxios.interceptors.response.use(
  (response) => {
    console.log(`[Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;
    console.error(`[Response Error] ${error}`);
    console.error('Error response:', error);

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const requestUrl = originalRequest.url || '';
      console.log('[Token Refresh] Attempting to refresh token');

      if (!retryMap.has(requestUrl)) {
        retryMap.set(requestUrl, 0);
      }

      const retryCount = retryMap.get(requestUrl);

      if (retryCount !== undefined && retryCount < MAX_REFRESH_ATTEMPTS) {
        retryMap.set(requestUrl, retryCount + 1);

        try {
          const state = store.getState();
          const currentAccessToken = state.auth.accessToken;
          
          if (!currentAccessToken) {
            throw new Error('No access token available for refresh');
          }

          const response = await axios.post(`${baseURL}/auth/refresh-token`, {}, {
            headers: { 'Authorization': `Bearer ${currentAccessToken}` }
          });

          if (response.status === 200) {
            console.log('[Token Refresh] Success');
            const newAccessToken = response.data.accessToken;
            store.dispatch(setAccessToken(newAccessToken));
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            retryMap.delete(requestUrl);
            return customAxios(originalRequest);
          } else {
            console.log('[Token Refresh] Failed with status:', response.status);
            clearAuthAndRedirect();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('[Token Refresh] Failed:', refreshError);
          clearAuthAndRedirect();
          return Promise.reject(error);
        }
      } else {
        console.log('[Token Refresh] Maximum attempts reached or retry count undefined');
        clearAuthAndRedirect();
        toast.error("Session expired. Please log in again.");
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      toast.error("You don't have permission to access this resource.");
    } else if (error.response?.status !== 401) {
      toast.error("An error occurred. Please try again.");
    }

    return Promise.reject(error);
  }
);


export default customAxios;