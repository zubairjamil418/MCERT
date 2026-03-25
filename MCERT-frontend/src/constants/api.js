import { getApiBaseUrl } from "../utils/apiUtils";

// API Base URL - Update this with your actual API base URL
export const API_BASE_URL = getApiBaseUrl();
console.log(API_BASE_URL);

// Forms API Endpoints
export const FORMS_API = {
  // Get all forms
  GET_ALL: `${API_BASE_URL}forms`,

  // Get single form by ID
  GET_BY_ID: (id) => `${API_BASE_URL}forms/${id}`,

  // Get single form by ID with full form data (retrieved from file storage)
  GET_BY_ID_WITH_DATA: (id) => `${API_BASE_URL}forms/${id}/data`,

  // Create new form
  CREATE: `${API_BASE_URL}forms`,

  // Update existing form
  UPDATE: (id) => `${API_BASE_URL}forms/${id}`,

  // Delete form
  DELETE: (id) => `${API_BASE_URL}forms/${id}`,

  // Submit form data
  SUBMIT: `${API_BASE_URL}forms/submit`,

  // Generate report
  GENERATE_REPORT: `${API_BASE_URL}forms/generate-report`,
};

// Second Forms API Endpoints (Form 2)
export const SECOND_FORMS_API = {
  // Get all forms
  GET_ALL: `${API_BASE_URL}second-forms`,

  // Get single form by ID
  GET_BY_ID: (id) => `${API_BASE_URL}second-forms/${id}`,

  // Get single form by ID with full form data (retrieved from file storage)
  GET_BY_ID_WITH_DATA: (id) => `${API_BASE_URL}second-forms/${id}/data`,

  // Create new form
  CREATE: `${API_BASE_URL}second-forms`,

  // Update existing form
  UPDATE: (id) => `${API_BASE_URL}second-forms/${id}`,

  // Delete form
  DELETE: (id) => `${API_BASE_URL}second-forms/${id}`,

  // Submit form data
  SUBMIT: `${API_BASE_URL}second-forms/submit`,

  // Generate report
  GENERATE_REPORT: `${API_BASE_URL}second-forms/generate-report`,
};

// Third Forms API Endpoints (Form 3)
export const THIRD_FORMS_API = {
  // Get all forms
  GET_ALL: `${API_BASE_URL}third-forms`,

  // Get single form by ID
  GET_BY_ID: (id) => `${API_BASE_URL}third-forms/${id}`,

  // Get single form by ID with full form data (retrieved from file storage)
  GET_BY_ID_WITH_DATA: (id) => `${API_BASE_URL}third-forms/${id}/data`,

  // Create new form
  CREATE: `${API_BASE_URL}third-forms`,

  // Update existing form
  UPDATE: (id) => `${API_BASE_URL}third-forms/${id}`,

  // Delete form
  DELETE: (id) => `${API_BASE_URL}third-forms/${id}`,

  // Submit form data
  SUBMIT: `${API_BASE_URL}third-forms/submit`,

  // Generate report
  GENERATE_REPORT: `${API_BASE_URL}third-forms/generate-report`,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// API Response Status
export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};

// Default API Headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// Auth Headers (if you have authentication)
export const getAuthHeaders = (token) => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${token}`,
});
