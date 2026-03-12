import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8085',
});

// Token Expiry Check
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
};

// Logout Function
const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // or use navigate() if using React Router
};

// Add a request interceptor to include JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        logoutUser();
        return Promise.reject(new Error('Session expired'));
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance as default, isTokenExpired, logoutUser };