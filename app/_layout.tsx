import { Slot } from "expo-router";
import { AuthProvider } from '../contexts/AuthContext';
import { EventProvider } from "../contexts/EventContext";
import { SettingsProvider } from "../contexts/SettingsContext"; // если есть

export default function RootLayout() {
    return (
        <AuthProvider>
            <EventProvider>
                <SettingsProvider>
                    <Slot />
                </SettingsProvider>
            </EventProvider>
        </AuthProvider>
    );
}