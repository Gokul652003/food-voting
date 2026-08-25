import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="employee" />
            <Stack.Screen name="chef" />
            <Stack.Screen name="admin" />
          </Stack>
        </AuthProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
