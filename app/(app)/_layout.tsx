// File: app/(app)/_layout.tsx
import React from 'react';
import {Drawer} from 'expo-router/drawer';
import {Redirect} from 'expo-router';
import {useAuth} from '../../contexts/AuthContext';
import DrawerContent from './DrawerContent';
import {EventProvider} from "../../contexts/EventContext";

export default function ProtectedLayout() {
    const {user, isLoading} = useAuth();

    if (isLoading) return null; // можно заменить на спиннер

    if (!user) {
        return <Redirect href="/(auth)/login"/>;
    }

    return (
        <EventProvider>
            <Drawer
                screenOptions={{headerShown: true}}
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="index" options={{title: 'Месяц'}}/>
                <Drawer.Screen name="dayView" options={{title: 'День'}}/>
                <Drawer.Screen name="event-list" options={{title: 'Список событий'}}/>
            </Drawer>
        </EventProvider>
    );
}
