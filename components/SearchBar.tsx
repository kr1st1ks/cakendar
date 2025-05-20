// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { CalendarEvent } from '../types';

interface SearchBarProps {
    events: CalendarEvent[];
}

export default function SearchBar({ events }: SearchBarProps): JSX.Element {
    const [query, setQuery] = useState<string>('');
    // Логику фильтрации можно доработать по необходимости
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Поиск событий..."
                value={query}
                onChangeText={setQuery}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
});