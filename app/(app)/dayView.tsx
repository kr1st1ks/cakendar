// File: app/(app)/dayView.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useEvents, Event } from '../../contexts/EventContext';
import FAB from '../../components/FAB';
import EventModalForm from '../../components/EventModalForm';

export default function DayView() {
    const { events, deleteEvent, addEvent, updateEvent } = useEvents();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [agendaItems, setAgendaItems] = useState<{ [date: string]: Event[] }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    useEffect(() => {
        const items: { [date: string]: Event[] } = {};
        events.forEach((event) => {
            const date = event.startDate;
            if (!items[date]) {
                items[date] = [];
            }
            items[date].push(event);
        });
        setAgendaItems(items);
    }, [events]);

    // Гарантируем, что для выбранной даты всегда есть массив событий
    const agendaData = { ...agendaItems };
    if (!agendaData[selectedDate]) {
        agendaData[selectedDate] = [];
    }

    const handleDelete = (eventId: string) => {
        Alert.alert('Удалить событие', 'Вы уверены, что хотите удалить это событие?', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Удалить', style: 'destructive', onPress: () => deleteEvent({ id: eventId }) },
        ]);
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        setModalVisible(true);
    };

    const openEditModal = (evt: Event) => {
        setEditingEvent(evt);
        setModalVisible(true);
    };

    const handleSave = (evt: Event) => {
        if (editingEvent) {
            updateEvent(evt);
        } else {
            addEvent(evt);
        }
    };

    // @ts-ignore
    return (
        <View style={styles.container}>
            <Agenda
                items={agendaData}
                selected={selectedDate}
                onDayChange={(day) => setSelectedDate(day.dateString)}
                renderItem={(item) => (
                    <TouchableOpacity onPress={() => openEditModal(item)} onLongPress={() => handleDelete(item.id)}>
                        <View style={styles.item}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
                            <Text style={styles.itemTime}>
                                {item.allDay ? 'Весь день' : `${item.startTime} - ${item.endTime}`}
                            </Text>
                            {item.tag && <Text style={styles.itemTag}>[{item.tag}]</Text>}
                        </View>
                    </TouchableOpacity>
                )}
                renderEmptyDate={() => (
                    <View style={styles.emptyDate}>
                        <Text>Нет событий</Text>
                    </View>
                )}
            />
            <FAB onPress={openCreateModal} />
            <EventModalForm
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                editingEvent={editingEvent}
                onSave={handleSave}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    item: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        elevation: 2,
    },
    itemTitle: { fontSize: 16, fontWeight: '500' },
    itemDesc: { fontSize: 14, color: '#555', marginTop: 5 },
    itemTime: { fontSize: 14, color: '#007AFF', marginTop: 5 },
    itemTag: { fontSize: 12, color: '#007AFF', marginTop: 3 },
    emptyDate: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
});