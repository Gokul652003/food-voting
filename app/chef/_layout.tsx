import { Tabs } from 'expo-router';
import React from 'react';

import { RoleGuard } from '@/components/RoleGuard';
import { tabIcon } from '@/components/TabIcon';
import { useTheme } from '@/constants/theme';

export default function ChefLayout() {
  const { colors, shadow } = useTheme();
  return (
    <RoleGuard role="chef">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 58,
            paddingTop: 6,
            ...shadow.sm,
          },
        }}
      >
        <Tabs.Screen name="prep" options={{ title: 'Prep Summary', tabBarIcon: tabIcon('🔥') }} />
        <Tabs.Screen name="daily-menu" options={{ title: 'Daily Menu', tabBarIcon: tabIcon('📋') }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('👤') }} />
      </Tabs>
    </RoleGuard>
  );
}
