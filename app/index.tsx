import { Redirect } from 'expo-router';
import React from 'react';

import { Splash } from '@/components/Splash';
import { useAuth } from '@/context/AuthContext';
import { roleHomePath } from '@/utils/roles';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;
  if (!user) return <Redirect href="/login" />;
  return <Redirect href={roleHomePath(user.role)} />;
}
