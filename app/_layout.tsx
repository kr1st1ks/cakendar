// File: app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { EventsProvider } from '@/context/EventContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <EventsProvider>
                <SettingsProvider>
                    <StatusBar style="dark" />
                    <Stack screenOptions={{ headerShown: false }} />
                </SettingsProvider>
            </EventsProvider>
        </AuthProvider>
    );
}