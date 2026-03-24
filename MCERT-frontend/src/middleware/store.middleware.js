import api from './api.middleware';

// Logger middleware
export const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

// API middleware
export const apiMiddleware = (store) => (next) => async (action) => {
  if (!action.api) {
    return next(action);
  }

  const { api: apiCall, types, ...rest } = action;
  const [REQUEST, SUCCESS, FAILURE] = types;

  // Dispatch request action
  store.dispatch({ type: REQUEST, ...rest });

  try {
    // Make API call
    const response = await api(apiCall);
    
    // Dispatch success action
    store.dispatch({
      type: SUCCESS,
      payload: response.data,
      ...rest,
    });

    return response.data;
  } catch (error) {
    // Dispatch failure action
    store.dispatch({
      type: FAILURE,
      error: error.response?.data || error.message,
      ...rest,
    });

    throw error;
  }
};

// Error handling middleware
export const errorMiddleware = () => (next) => (action) => {
  if (action.error) {
    console.error('Error:', action.error);
    // You can add global error handling here (e.g., showing toast notifications)
  }
  return next(action);
}; 