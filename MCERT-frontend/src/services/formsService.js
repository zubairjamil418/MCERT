import {
  FORMS_API,
  HTTP_METHODS,
  DEFAULT_HEADERS,
  getAuthHeaders,
} from "../constants/api";


// Helper function to make API calls
const makeApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API call failed:", error);
    return { success: false, error: error.message };
  }
};

// Forms Service
export const formsService = {
  // Get all forms with pagination
  getAllForms: async (
    token = null,
    page = 1,
    limit = 5,
    sortOrder = "desc"
  ) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    const url = `${FORMS_API.GET_ALL}?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
    return makeApiCall(url, {
      method: HTTP_METHODS.GET,
      headers,
    });
  },

  // Get single form by ID
  getFormById: async (id, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.GET_BY_ID(id), {
      method: HTTP_METHODS.GET,
      headers,
    });
  },

  // Get single form by ID with full formData (from file storage)
  getFormWithData: async (id, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.GET_BY_ID_WITH_DATA(id), {
      method: HTTP_METHODS.GET,
      headers,
    });
  },

  // Create new form
  createForm: async (formData, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.CREATE, {
      method: HTTP_METHODS.POST,
      headers,
      body: JSON.stringify(formData),
    });
  },

  // Update existing form
  updateForm: async (id, formData, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.UPDATE(id), {
      method: HTTP_METHODS.PATCH,
      headers,
      body: JSON.stringify({ formData: formData, status: "completed" }),
    });
  },

  // Delete form
  deleteForm: async (id, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.DELETE(id), {
      method: HTTP_METHODS.DELETE,
      headers,
    });
  },

  // Submit form data
  submitForm: async (formData, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.SUBMIT, {
      method: HTTP_METHODS.POST,
      headers,
      body: JSON.stringify(formData),
    });
  },

  // Generate report
  generateReport: async (formData, token = null) => {
    const headers = token ? getAuthHeaders(token) : DEFAULT_HEADERS;
    return makeApiCall(FORMS_API.GENERATE_REPORT, {
      method: HTTP_METHODS.POST,
      headers,
      body: JSON.stringify(formData),
    });
  },
};

// Error handling utilities
export const handleApiError = (
  error,
  fallbackMessage = "An error occurred"
) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallbackMessage;
};

// Success message utilities
export const getSuccessMessage = (action) => {
  const messages = {
    create: "Form created successfully!",
    update: "Form updated successfully!",
    delete: "Form deleted successfully!",
    submit: "Form submitted successfully!",
  };
  return messages[action] || "Operation completed successfully!";
};
