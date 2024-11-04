import React, { createContext, useState } from 'react';
import { loginUser } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async ({ username, password }) => {
    try {
      const accessToken = await loginUser(username, password);
      setToken(accessToken); // Save token in state
      localStorage.setItem('jwtToken', accessToken); // Ensure it's stored in localStorage
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
