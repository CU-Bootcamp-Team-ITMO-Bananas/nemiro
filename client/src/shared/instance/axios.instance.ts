import axios from 'axios';
import { API_URL } from '@/shared/constants';
import { getAuthStoreMethods } from '../stores/auth.store';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  const { user } = getAuthStoreMethods();
  if (user) {
    config.headers['User-Id'] = user.id;
  }
  return config;
});

export const axiosInstance = instance;
