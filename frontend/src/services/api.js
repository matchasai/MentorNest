import axios from "axios";
import toast from "react-hot-toast";

let onSessionExpired = null;
export function setSessionExpiredHandler(fn) {
  onSessionExpired = fn;
}

const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
    : "http://localhost:8081/api",
  withCredentials: true, // Always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response: Handle errors globally
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      // Token expired or invalid - clear it and redirect to login
      localStorage.removeItem('jwt_token');
      if (onSessionExpired) onSessionExpired();
      return Promise.reject(err);
    } else if (err.response && err.response.status === 403) {
      // Forbidden - user doesn't have permission
      // Don't log or show errors for auth/me checks (expected when not logged in)
      if (err.config?.url?.includes('/auth/me')) {
        return Promise.reject(err);
      }

      // Don't show toast for 403 errors in dashboard/protected routes
      const isApiCall = err.config?.url?.includes('/api/');
      if (isApiCall && !err.config?.url?.includes('/auth/')) {
        return Promise.reject(err);
      }

      toast.error(err.response.data?.message || "Access denied");
      return Promise.reject(err);
    } else if (err.response) {
      if (err.response.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred.");
      }
    } else {
      toast.error("Network error. Please try again.");
    }
    return Promise.reject(err);
  }
);

export default api; 