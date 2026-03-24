// Utility functions for API URL construction
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.endsWith("/")
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_API_URL + "/";
  }

  if (import.meta.env.VITE_BACKEND_URL) {
    const baseURL = import.meta.env.VITE_BACKEND_URL.endsWith("/")
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_BACKEND_URL + "/";
    return baseURL + "";
  }

  return "api/";
};

export const getBackendBaseUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.endsWith("/")
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_BACKEND_URL + "/";
  }

  return "";
};

export const constructApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};

export const constructBackendUrl = (endpoint) => {
  const baseUrl = getBackendBaseUrl();
  return `${baseUrl}${endpoint}`;
};

// Enhanced fetch function that automatically includes ngrok headers
export const fetchWithNgrokHeaders = async (url, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  const enhancedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, enhancedOptions);
};
