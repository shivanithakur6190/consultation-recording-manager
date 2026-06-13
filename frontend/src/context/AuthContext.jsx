import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crm-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await getCurrentUser();
          setUser(res.data);
          localStorage.setItem('crm-user', JSON.stringify(res.data));
        } catch (err) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('crm-token');
          localStorage.removeItem('crm-user');
        }
      }
      setLoading(false);
    };
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const login = async (credentials) => {
  const res = await loginUser(credentials);

  const userData = res.data.user;
  const jwtToken = res.data.token;

  setUser(userData);
  setToken(jwtToken);

  localStorage.setItem('crm-token', jwtToken);
  localStorage.setItem('crm-user', JSON.stringify(userData));

  toast.success(`Welcome back, ${userData.name}!`);

  return res;
};

  const register = async (data) => {
    const res = await registerUser(data);
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('crm-token', jwtToken);
    localStorage.setItem('crm-user', JSON.stringify(userData));
    toast.success(`Welcome, ${userData.name}! Account created.`);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm-token');
    localStorage.removeItem('crm-user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};