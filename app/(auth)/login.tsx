// File: app/login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { user, loginWithGoogle, loginWithApple, loginWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            router.replace('/(app)');
        }
    }, [user]);

    const handleEmailLogin = async () => {
        try {
            await loginWithEmail(email, password);
        } catch (err) {
            Alert.alert('Ошибка', 'Неверный email или пароль');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вход в приложение</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
                <Text style={styles.buttonText}>Войти по Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={loginWithGoogle}>
                <Text style={styles.buttonText}>Войти через Google</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.button} onPress={loginWithApple}>
                    <Text style={styles.buttonText}>Войти через Apple</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.linkText}>Нет аккаунта? Зарегистрироваться</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10 },
    button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 5, width: '100%', marginBottom: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
    linkText: { marginTop: 10, color: '#007AFF', fontSize: 14 },
});