import axios from "axios";
import { getApiBaseUrl } from "../utils/apiUtils";

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "any-value",
    "ngrok-skip-browser-warning": "true",
  },
  // Ensure credentials are sent with requests (for cookies if needed)
  withCredentials: false,
});

// Request interceptor (token handling disabled - now handled manually in apiService)
api.interceptors.request.use(
  (config) => {
    // Log request for debugging (remove in production)
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging (remove in production)
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error for debugging
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: originalRequest?.url,
      config: error.config,
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post("/auth/refresh", { refreshToken });

        // Update stored token
        const { token } = response.data;
        localStorage.setItem("token", token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    // Handle CORS errors specifically
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      console.error("CORS or Network Error detected. Please ensure:");
      console.error("1. Backend server is running");
      console.error("2. Backend has proper CORS configuration");
      console.error("3. API URL is correct");
    }

    return Promise.reject(error);
  }
);

export default api;
