'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  adminUser: any | null;
  adminToken: string | null;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      setAdminToken(savedToken);
      setAdminUser(JSON.parse(savedUser));
    }
    setIsAdminLoading(false);
  }, []);

  const adminLogin = async (email: string, password: string) => {
    const { adminApi } = await import('@/services/admin');
    const response = await adminApi.login(email, password);
    const { user, token } = response.data;

    setAdminUser(user);
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  };

  const adminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, adminToken, adminLogin, adminLogout, isAdminLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
