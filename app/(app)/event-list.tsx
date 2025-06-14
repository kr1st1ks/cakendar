// File: app/(app)/event-list.tsx
import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar} from 'react-native';
import {useEvents} from '../../contexts/EventContext';
import {useRouter} from 'expo-router';
import {Event} from "./index";
import FAB from "../../components/FAB";

export default function EventListScreen() {
    const {events, deleteEvent} = useEvents();
    const router = useRouter();
    const handleDeleteEvent = (id: string) => {
        Alert.alert('Удалить событие', 'Вы уверены, что хотите удалить это событие?', [
            {text: 'Отмена', style: 'cancel'},
            {text: 'Удалить', style: 'destructive', onPress: () => deleteEvent(id)},
        ]);
    };

    // @ts-ignore
    return (

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <>
                        <Text style={styles.header}>Список событий</Text>
                        {events.length === 0 && <Text style={styles.noEventsText}>Событий пока нет</Text>}
                    </>
                }
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.eventItem}
                                      onPress={() => router.push(`/event-form/${item.id}`)}
                                      onLongPress={() => handleDeleteEvent(item.id)}
                    >
                        <Text style={styles.eventTitle}>{item.title}</Text>
                        <Text
                            style={styles.eventDates}>{item.startDate} {item.endDate ? `- ${item.endDate}` : ''}</Text>
                    </TouchableOpacity>
                )}
            />

            <FAB onPress={() => router.push(`/(app)/event-form/new`)}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#fff'},
    header: {fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center'},
    noEventsText: {textAlign: 'center', fontStyle: 'italic', color: '#888'},
    eventItem: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginBottom: 10,
    },
    eventTitle: {fontSize: 18, fontWeight: '500'},
    eventDates: {fontSize: 14, color: '#555'},
});