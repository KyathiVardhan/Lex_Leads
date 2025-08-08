import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_PORT_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
