import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useData } from '@/context/DataContext';
import { readValue, removeValue, writeValue } from '@/services/storage';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = 'session-user-id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { users, loading: dataLoading } = useData();
  const [userId, setUserId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    readValue<string>(SESSION_KEY).then((id) => {
      setUserId(id);
      setRestoring(false);
    });
  }, []);

  const user = userId ? users.find((u) => u.id === userId) ?? null : null;

  const login = useCallback(
    async (email: string) => {
      const normalized = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === normalized);
      if (!found) throw new Error('No account found for that email.');
      await writeValue(SESSION_KEY, found.id);
      setUserId(found.id);
      return found;
    },
    [users]
  );

  const logout = useCallback(async () => {
    await removeValue(SESSION_KEY);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: dataLoading || restoring, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
