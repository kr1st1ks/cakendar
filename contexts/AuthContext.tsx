// File: contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
    user: any | null; // firebase.User (тип можно расширить)
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

const USER_KEY = 'firebaseUser';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Загрузка сохранённого пользователя (опционально, firebase обычно восстанавливает сессию)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(USER_KEY);
                if (storedUser) {
                    // Можно сохранить uid, но firebase сам восстанавливает объект user через onAuthStateChanged
                }
            } catch (error) {
                console.error("Ошибка загрузки пользователя:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    // Подписка на изменения аутентификации Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsLoading(false);
            if (firebaseUser) {
                AsyncStorage.setItem(USER_KEY, JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email })).catch(console.error);
            } else {
                AsyncStorage.removeItem(USER_KEY).catch(console.error);
            }
        });
        return () => unsubscribe();
    }, []);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '<EXPO_GOOGLE_CLIENT_ID>',
        iosClientId: '<IOS_GOOGLE_CLIENT_ID>',
        androidClientId: '<ANDROID_GOOGLE_CLIENT_ID>',
        webClientId: '<WEB_GOOGLE_CLIENT_ID>',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            // Firebase обновит состояние через onAuthStateChanged
        }
    }, [response]);

    const loginWithGoogle = async () => {
        try {
            await promptAsync();
        } catch (err) {
            console.error("Ошибка входа через Google:", err);
        }
    };

    const loginWithApple = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            // Firebase обновит состояние через onAuthStateChanged
        } catch (err: any) {
            if (err.code === 'ERR_CANCELED') {
                console.log("Вход через Apple отменён");
            } else {
                console.error("Ошибка входа через Apple:", err);
            }
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Ошибка входа по email:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Ошибка регистрации по email:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    const authContextValue: AuthContextType = {
        user,
        isLoading,
        loginWithGoogle,
        loginWithApple,
        loginWithEmail,
        registerWithEmail,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};