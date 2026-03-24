import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from 'contexts/AuthContext';

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import Landing from "views/landing";
import ProtectedRoute from "components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin/*" element={<AdminLayout />} />
          <Route path="rtl/*" element={<RtlLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
