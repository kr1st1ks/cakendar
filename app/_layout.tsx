// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

export default function RootLayout() {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <Stack>
                {/* По умолчанию открывается экран входа (index.tsx) */}
                <Stack.Screen name="index" options={{ headerShown: false }} />
                {/* Экран календаря */}
                <Stack.Screen name="calendar" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}