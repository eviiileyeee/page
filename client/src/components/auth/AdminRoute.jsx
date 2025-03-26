import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default AdminRoute; 