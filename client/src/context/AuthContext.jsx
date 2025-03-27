import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api';
import { notificationService } from '../services/notificationService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('adminToken');
        
        // Try admin auth first if admin token exists
        if (adminToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
          try {
            const adminResponse = await api.get('/api/admin/me');
            if (adminResponse.data) {
              setAdmin(adminResponse.data);
              localStorage.setItem('admin', JSON.stringify(adminResponse.data));
              // Clear any user session
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setInitialized(true);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Admin verification failed:', error);
            handleAuthError('admin');
          }
        }

        // Try user auth if admin auth failed or no admin token
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            const response = await api.get('/api/auth/me');
            if (response.data) {
              setUser(response.data);
              localStorage.setItem('user', JSON.stringify(response.data));
              setInitialized(true);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('User verification failed:', error);
            handleAuthError('user');
          }
        }

        // If no valid tokens found, complete initialization
        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleAuthError('all');
        setInitialized(true);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleAuthError = (type) => {
    switch (type) {
      case 'admin':
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        delete api.defaults.headers.common['Authorization'];
        setAdmin(null);
        break;
      case 'user':
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        break;
      case 'all':
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setAdmin(null);
        break;
    }
  };

  const login = async (email, password) => {
    try {
      // Clear any existing admin session
      handleAuthError('admin');

      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      await notificationService.postNotifications({
        id: userData._id,
        type: 'security',
        title: 'New login detected',
        message: 'A new login was detected from Chrome on Windows.',
        timestamp: new Date().toISOString(),
        read: false,
        icon: 1,
      });

      toast.success('Successfully logged in!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      handleAuthError('user');
      return false;
    }
  };

  const adminLogin = async (email, password, adminKey) => {
    try {
      // Clear any existing user session
      handleAuthError('user');

      const response = await api.post('/api/auth/admin/login', { 
        email, 
        password, 
        adminKey 
      });
      const { token, user: adminData } = response.data;

      if (adminData.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(adminData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(adminData);

      toast.success('Successfully logged in as admin!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
      handleAuthError('admin');
      return false;
    }
  };

  const logout = () => {
    handleAuthError('user');
    toast.success('Logged out successfully');
  };

  const adminLogout = () => {
    handleAuthError('admin');
    toast.success('Admin logged out successfully');
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      toast.success('Successfully registered!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      console.log("Inside update route::::");
  
      const formData = new FormData();
      formData.append("_id", updatedUser._id);
      formData.append("username", updatedUser.username);
      formData.append("email", updatedUser.email);
      formData.append("phoneNumber", updatedUser.phoneNumber);
      formData.append("githubUrl", updatedUser.githubUrl);
      formData.append("facebookUrl", updatedUser.facebookUrl);
      formData.append("instagramUrl", updatedUser.instagramUrl);
      formData.append("discription", updatedUser.discription);
      formData.append("profession", updatedUser.profession);

      if (updatedUser.profileImage) {
        formData.append("profileImage", updatedUser.profileImage);
      }

      const response = await api.put(`/api/auth/uploadDetails/${updatedUser._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { user } = response.data;
      console.log("User returned by server:", user);
      setUser(user);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const value = {
    user,
    admin,
    loading,
    initialized,
    login,
    adminLogin,
    logout,
    adminLogout,
    register,
    updateUser,
    isAuthenticated: !!user,
    isAdminAuthenticated: !!admin
  };

  // Don't render anything until initial auth check is complete
  if (!initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
