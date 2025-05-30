// File: app/(app)/_layout.tsx
import React from 'react';
import {Drawer} from 'expo-router/drawer';
import {Redirect} from 'expo-router';
import {useAuth} from '../../contexts/AuthContext';
import DrawerContent from './DrawerContent';
import {EventProvider} from "../../contexts/EventContext";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProtectedLayout() {
    const {user, isLoading} = useAuth();

    if (isLoading) return null; // можно заменить на спиннер

    if (!user) {
        return <Redirect href="/(auth)/login"/>;
    }

    return (
        <EventProvider>
            <Drawer
                screenOptions={({ navigation }) => ({
                    headerShown: false,
                    headerLeft: ({ tintColor }) => (
                        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
                            <Ionicons name="menu" size={28} color={tintColor || "#007AFF"} />
                        </TouchableOpacity>
                    ),
                })}
                drawerContent={(props) => <DrawerContent {...props} />}
            >
                <Drawer.Screen name="index" options={{title: 'Месяц'}}/>
                <Drawer.Screen name="event-list" options={{title: 'Список событий'}}/>
            </Drawer>
        </EventProvider>
    );
}
