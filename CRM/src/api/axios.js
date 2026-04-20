import axios from 'axios';

const normalizeApiBaseURL = (value) => {
  if (!value) return null;

  const raw = value.trim().replace(/\/+$/, '');

  if (/^https?:\/\//i.test(raw)) {
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }

  if (raw.startsWith('localhost') || raw.startsWith('127.0.0.1')) {
    return raw.endsWith('/api') ? `http://${raw}` : `http://${raw}/api`;
  }

  return raw.endsWith('/api') ? `https://${raw}` : `https://${raw}/api`;
};

// Determine API base URL based on environment
const getBaseURL = () => {
  // Production: Use environment variable
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiBaseURL(import.meta.env.VITE_API_URL);
  }
  
  // Development: Use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Fallback for production without env var (should be avoided)
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const isPublicAuthEndpoint = (url) => {
  // Avoid sending potentially stale JWTs to login endpoints, and avoid treating
  // OTP failures as "JWT expired" in the response interceptor.
  return typeof url === 'string' && (
    url.includes('/auth/request-otp') ||
    url.includes('/auth/verify-otp')
  );
};

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token && !isPublicAuthEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// For now, it's just a basic setup. The Login page will handle saving the JWT.
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url;
      const hadAuthHeader = !!error.config?.headers?.Authorization;

      // Only treat 401s as "session expired" when we actually tried to use a token.
      if (hadAuthHeader && !isPublicAuthEndpoint(requestUrl)) {
        localStorage.removeItem('jwt_token');
        console.error('Unauthorized access - JWT may be invalid or expired.');
      } else {
        console.warn('Unauthorized response (likely invalid credentials or OTP).');
      }
      // window.location.href = '/login'; // This might be handled by AuthContext or router
    } else if (error.response && error.response.data) {
      // Log other errors with more detail if available
      console.error('API Error:', error.response.data);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
