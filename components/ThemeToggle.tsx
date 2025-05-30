// components/ThemeToggle.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

export default function ThemeToggle(): JSX.Element {
    const [darkTheme, setDarkTheme] = useState<boolean>(false);
    const animation = new Animated.Value(0);

    const toggleTheme = () => {
        Animated.timing(animation, {
            toValue: darkTheme ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setDarkTheme(!darkTheme);
        // Можно интегрировать глобальное состояние темы, например, через Context API
    };

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#fff', '#333'],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <TouchableOpacity onPress={toggleTheme}>
                <Text style={styles.text}>{darkTheme ? 'Светлая тема' : 'Тёмная тема'}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 8, borderRadius: 5, margin: 5 },
    text: { color: '#000' },
});