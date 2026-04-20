import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
      }

      else if (status === 403) {
        console.error('Access forbidden:', error.response.data?.message || 'You do not have permission');
      }

      else if (status >= 500) {
        console.error('Server error:', error.response.data?.message || 'Internal server error');
      }
    }

    else if (error.request) {
      console.error('Network error: No response received from server');
    }

    return Promise.reject(error);
  }
);

export default api;