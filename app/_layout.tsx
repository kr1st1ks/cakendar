// File: app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Slot />
    </AuthProvider>
  );
}