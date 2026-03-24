import api from "../middleware/api.middleware";

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to create headers with token
const createAuthHeaders = (customHeaders = {}) => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
};

// Unified API service using the fixed axios instance
export const apiService = {
  // Generic GET request
  get: async (endpoint, config = {}) => {
    try {
      const headers = createAuthHeaders(config.headers);
      const response = await api.get(endpoint, { ...config, headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API GET Error:", error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  },

  // Generic POST request
  post: async (endpoint, data = {}, config = {}) => {
    try {
      const headers = createAuthHeaders(config.headers);
      const response = await api.post(endpoint, data, { ...config, headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API POST Error:", error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  },

  // Generic PUT request
  put: async (endpoint, data = {}, config = {}) => {
    try {
      const headers = createAuthHeaders(config.headers);
      const response = await api.put(endpoint, data, { ...config, headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API PUT Error:", error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  },

  // Generic PATCH request
  patch: async (endpoint, data = {}, config = {}) => {
    try {
      const headers = createAuthHeaders(config.headers);
      const response = await api.patch(endpoint, data, { ...config, headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API PATCH Error:", error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  },

  // Generic DELETE request
  delete: async (endpoint, config = {}) => {
    try {
      const headers = createAuthHeaders(config.headers);
      const response = await api.delete(endpoint, { ...config, headers });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API DELETE Error:", error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
      };
    }
  },
};

// Auth-specific API methods
export const authApi = {
  // Login
  login: async (credentials) => {
    return apiService.post("/auth/sign-in", credentials);
  },

  // Signup
  signup: async (userData) => {
    return apiService.post("/auth/sign-up", userData);
  },

  // Logout
  logout: async () => {
    return apiService.post("/auth/logout");
  },

  // Get current user
  getCurrentUser: async () => {
    return apiService.get("/auth/me");
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    return apiService.post("/auth/refresh", { refreshToken });
  },
};

// Forms-specific API methods
export const formsApi = {
  // Get all forms
  getAll: async () => {
    return apiService.get("forms");
  },

  // Get form by ID
  getById: async (id) => {
    return apiService.get(`/forms/${id}`);
  },

  // Create form
  create: async (formData) => {
    return apiService.post("/forms", formData);
  },

  // Update form
  update: async (id, formData) => {
    return apiService.patch(`/forms/${id}`, formData);
  },

  // Delete form
  delete: async (id) => {
    return apiService.delete(`/forms/${id}`);
  },

  // Submit form
  submit: async (formData) => {
    return apiService.post("/forms/submit", formData);
  },

  // Generate report
  generateReport: async (formData) => {
    return apiService.post("/forms/generate-report", formData);
  },
};

// Second Forms-specific API methods
export const secondFormsApi = {
  getAll: async () => apiService.get("second-forms"),
  getById: async (id) => apiService.get(`/second-forms/${id}`),
  create: async (formData) => apiService.post("/second-forms", formData),
  update: async (id, formData) => apiService.patch(`/second-forms/${id}`, formData),
  delete: async (id) => apiService.delete(`/second-forms/${id}`),
  submit: async (formData) => apiService.post("/second-forms/submit", formData),
  generateReport: async (formData) => apiService.post("/second-forms/generate-report", formData),
};

// Third Forms-specific API methods
export const thirdFormsApi = {
  getAll: async () => apiService.get("third-forms"),
  getById: async (id) => apiService.get(`/third-forms/${id}`),
  create: async (formData) => apiService.post("/third-forms", formData),
  update: async (id, formData) => apiService.patch(`/third-forms/${id}`, formData),
  delete: async (id) => apiService.delete(`/third-forms/${id}`),
  submit: async (formData) => apiService.post("/third-forms/submit", formData),
  generateReport: async (formData) => apiService.post("/third-forms/generate-report", formData),
};

export default apiService;
