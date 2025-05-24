
import axios from 'axios';

// API base URL - adjust if needed to point to your Corners backend
const API_URL = "http://localhost:3000";

// Types
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
}

// Authentication API functions
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/register`, credentials);
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/api/auth/logout`);
  return response.data;
};

// Helper function to set auth token in axios headers
export const setAuthToken = (token: string | null): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Function to check if user is already authenticated
export const checkAuthStatus = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  try {
    setAuthToken(token);
    // You could add an endpoint to verify token validity if needed
    // For now, we'll just assume the token is valid and return the stored user info
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    return null;
  }
};
