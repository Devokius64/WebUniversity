// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохранённую сессию при загрузке
    const stored = localStorage.getItem('auth_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        // Проверяем, не истекла ли сессия (24 часа)
        if (session.expiresAt > Date.now()) {
          setUser(session.user);
        } else {
          localStorage.removeItem('auth_session');
        }
      } catch (e) {
        localStorage.removeItem('auth_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const session = {
      user: userData,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 часа
    };
    localStorage.setItem('auth_session', JSON.stringify(session));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
  
  // Обновляем сессию в localStorage
  const stored = localStorage.getItem('auth_session');
  if (stored) {
    const session = JSON.parse(stored);
    session.user = updatedUser;
    localStorage.setItem('auth_session', JSON.stringify(session));
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}