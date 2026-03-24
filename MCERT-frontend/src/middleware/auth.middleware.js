import { Navigate } from 'react-router-dom';

// Authentication middleware component
export const AuthMiddleware = ({ children }) => {
  // Get authentication status (you can replace this with your actual auth check)
  const isAuthenticated = localStorage.getItem('token') !== null;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

// Protected route wrapper
export const ProtectedRoute = ({ element }) => {
  return (
    <AuthMiddleware>
      {element}
    </AuthMiddleware>
  );
}; 