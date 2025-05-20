// File: app/(app)/_layout.tsx
import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Drawer} from 'expo-router/drawer';
import {Redirect, useRouter, usePathname} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import DrawerContent from './DrawerContent';

export default function ProtectedLayout() {
    const {user, isLoading} = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Получаем текущий путь

    if (isLoading) return null; // можно заменить на спиннер

    if (!user) {
        return <Redirect href="/login"/>;
    }

    return (
        <>
            <Drawer
                screenOptions={{headerShown: true}}
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="index" options={{title: 'Месяц'}}/>
                <Drawer.Screen name="dayView" options={{title: 'День'}}/>
                <Drawer.Screen name="event-list" options={{title: 'Список событий'}}/>
            </Drawer>
        </>
    );
}
