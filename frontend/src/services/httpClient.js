import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in every request except for specific routes
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    // Exclude registration and login routes from adding the Authorization header
    if (token && !config.url.includes('/register') && !config.url.includes('/login')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default httpClient;