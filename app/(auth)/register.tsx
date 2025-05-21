// File: app/register.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { user, registerWithEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            router.replace('/(app)');
        }
    }, [user]);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }
        try {
            await registerWithEmail(email, password);
        } catch (err) {
            Alert.alert('Ошибка регистрации', 'Не удалось создать аккаунт');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Подтвердите пароль"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
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