import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const AdminRoute = ({ children }) => {
  const { admin, loading, initialized } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    let timeoutId;

    // Only start redirect process if we're fully initialized and not loading
    if (initialized && !loading) {
      const adminToken = localStorage.getItem('adminToken');
      
      // Only redirect if there's no admin AND no admin token
      if (!admin && !adminToken) {
        timeoutId = setTimeout(() => {
          setShouldRedirect(true);
        }, 1000);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialized, loading, admin]);

  // Don't render anything during initialization
  if (!initialized) {
    return null;
  }

  // Show loader while checking auth or during the delay
  if (loading || (!shouldRedirect && !admin)) {
    return <Loader />;
  }

  // Only redirect if we're sure there's no admin session
  if (shouldRedirect) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verify admin role if we have an admin
  if (admin && admin.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 