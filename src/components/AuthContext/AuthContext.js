import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login', { replace: true });
        } else {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          fetchUser();
        }
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/user');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    checkTokenExpiry();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.user);
      navigate('/welcome', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
