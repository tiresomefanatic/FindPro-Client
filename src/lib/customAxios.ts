"use client"
import axios from 'axios';
// import { Cookies } from 'react-cookie';

// const cookies = new Cookies();

import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';


const customAxios = axios.create({
  baseURL: 'http://localhost:8080', // Set your API base URL
});

customAxios.interceptors.request.use((config) => {
  const accessToken = getCookies();

  console.log('token in frontend', accessToken)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default customAxios;