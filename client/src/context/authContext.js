import { createContext, useCallback, useEffect, useState } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState(false);

  const refreshSession = useCallback(async () => {
    setIsCheckingSession(true);
    setSessionError(false);
    try {
      const { data } = await api.get('/session');
      setCurrentUser(data);
    } catch (error) {
      setCurrentUser(null);
      if (error.response?.status !== 401) setSessionError(true);
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem('user');
    refreshSession();
    const interceptor = api.interceptors.response.use(undefined, (error) => {
      if (error.response?.status === 401 && !['/login', '/session'].includes(error.config?.url)) {
        setCurrentUser(null);
      }
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshSession]);

  const login = async (inputs) => {
    const { data } = await api.post('/login', inputs);
    setCurrentUser(data);
    setSessionError(false);
  };

  const logout = async () => {
    await api.post('/logout');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isCheckingSession, sessionError, refreshSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
