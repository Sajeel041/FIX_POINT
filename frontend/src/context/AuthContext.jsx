import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Get API URL - ensure it's always absolute
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure API_URL doesn't have trailing slash and is absolute
if (API_URL) {
  API_URL = API_URL.trim().replace(/\/$/, '');
  // If it's a relative path in production, that's an error
  if (import.meta.env.PROD && !API_URL.startsWith('http')) {
    console.error('⚠️ VITE_API_URL must be a full URL (e.g., https://your-backend.vercel.app/api)');
    API_URL = ''; // Will cause errors, but at least it's clear
  }
}

// Warn if API URL is not set in production
if (import.meta.env.PROD && (!import.meta.env.VITE_API_URL || !API_URL)) {
  console.error('⚠️ VITE_API_URL is not set! Set it in Vercel: Settings → Environment Variables → Add VITE_API_URL = https://your-backend.vercel.app/api');
}

// Set up axios interceptor to include token in all requests
const setupAxiosInterceptor = () => {
  // Request interceptor to add token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - clear it
        localStorage.removeItem('token');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          // Dispatch event to notify AuthContext
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
      }
      return Promise.reject(error);
    }
  );
};

// Initialize axios interceptor once
setupAxiosInterceptor();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenFromStorage = localStorage.getItem('token');
  const [token, setToken] = useState(tokenFromStorage);
  const isInitialized = useRef(false);

  // Set axios default header synchronously on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    }
    isInitialized.current = true;
  }, []);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Update axios header when token changes
  useEffect(() => {
    if (isInitialized.current) {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${API_URL}/auth/me`);
          // Ensure roles array exists
          if (data.user && !data.user.roles) {
            data.user.roles = [data.user.role || 'customer'];
          }
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      // Ensure roles array exists
      if (!data.roles) {
        data.roles = [data.role || 'customer'];
      }
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      // Ensure roles array exists
      if (!data.roles) {
        data.roles = [data.role || 'customer'];
      }
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
