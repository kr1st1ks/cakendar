// File: app/(app)/DrawerContent.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function DrawerContent(props: any) {
    const { user, logout } = useAuth();
    const router = useRouter();

    // Сегменты для переключения между режимами просмотра
    const segments = [
        { label: 'Список', screen: 'event-list' },
        { label: 'Месяц', screen: '' },
    ];

    const [selectedSegment, setSelectedSegment] = useState<string>('index');

    const onSegmentPress = (screen: string) => {
        setSelectedSegment(screen);
        // @ts-ignore
        router.replace(`/(app)/${screen}`);
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.profileContainer}>
                <Text style={styles.profileName}>
                    {user?.displayName || user?.email || 'Профиль'}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Сегментированный контрол для переключения между экранами */}
            <View style={styles.segmentContainer}>
                {segments.map((seg) => (
                    <TouchableOpacity
                        key={seg.label}
                        style={[
                            styles.segmentButton,
                            selectedSegment === seg.screen && styles.segmentButtonActive,
                        ]}
                        onPress={() => onSegmentPress(seg.screen)}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                selectedSegment === seg.screen && styles.segmentTextActive,
                            ]}
                        >
                            {seg.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            <DrawerItem
                label="Выход"
                onPress={async () => {
                    await logout();
                    router.replace('/login');
                }}
                labelStyle={styles.logoutLabel}
            />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        padding: 20,
        backgroundColor: '#007AFF',
    },
    profileName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    segmentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        alignItems: 'center',
    },
    segmentButtonActive: {
        backgroundColor: '#007AFF',
    },
    segmentText: {
        fontSize: 16,
        color: '#333',
    },
    segmentTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    logoutLabel: {
        color: '#d11a2a',
        fontSize: 16,
        fontWeight: '600',
    },
});