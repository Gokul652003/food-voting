import { Redirect } from 'expo-router';
import React from 'react';

import { Splash } from '@/components/Splash';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { roleHomePath } from '@/utils/roles';

interface RoleGuardProps {
  role: Role;
  children: React.ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;
  if (!user) return <Redirect href="/login" />;
  if (user.role !== role) return <Redirect href={roleHomePath(user.role)} />;
  return <>{children}</>;
}
