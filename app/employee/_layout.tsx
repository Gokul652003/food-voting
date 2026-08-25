import { Tabs } from 'expo-router';
import React from 'react';

import { RoleGuard } from '@/components/RoleGuard';
import { tabIcon } from '@/components/TabIcon';
import { useTheme } from '@/constants/theme';

export default function EmployeeLayout() {
  const { colors } = useTheme();
  return (
    <RoleGuard role="employee">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}
      >
        <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: tabIcon('🍽️') }} />
        <Tabs.Screen name="my-votes" options={{ title: 'My Votes', tabBarIcon: tabIcon('🗳️') }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('👤') }} />
      </Tabs>
    </RoleGuard>
  );
}
