import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEvents } from '../../../contexts/EventContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function EventFormScreen() {
    const router = useRouter();
    const { eventId } = useLocalSearchParams();
    const { events, addEvent, updateEvent, deleteEvent } = useEvents();
    const { user } = useAuth();

    // Проверяем, редактирование или создание
    const editing = eventId && eventId !== 'new';
    const editingEvent = editing ? events.find((ev) => ev.id === eventId) : null;

    const [title, setTitle] = useState(editingEvent ? editingEvent.title : '');
    const [description, setDescription] = useState(editingEvent ? editingEvent.description || '' : '');
    const [allDay, setAllDay] = useState(editingEvent ? editingEvent.allDay : false);

    const [startDateTime, setStartDateTime] = useState<Date>(
        editingEvent
            ? new Date(`${editingEvent.startDate}T${editingEvent.startTime || '00:00'}`)
            : new Date()
    );
    const [endDateTime, setEndDateTime] = useState<Date>(
        editingEvent
            ? new Date(`${editingEvent.endDate || editingEvent.startDate}T${editingEvent.endTime || '23:59'}`)
            : new Date()
    );
    const [tag, setTag] = useState(editingEvent ? editingEvent.tag || '' : '');
    const [color, setColor] = useState<string>(editingEvent ? editingEvent.color || '#007AFF' : '#007AFF');

    // Для выбора даты/времени
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentPicker, setCurrentPicker] = useState<'start' | 'end' | null>(null);

    const showPicker = (picker: 'start' | 'end') => {
        setCurrentPicker(picker);
        setPickerVisible(true);
    };
    const hidePicker = () => {
        setPickerVisible(false);
        setCurrentPicker(null);
    };
    const handleConfirm = (selectedDate: Date) => {
        if (currentPicker === 'start') {
            setStartDateTime(selectedDate);
        } else if (currentPicker === 'end') {
            setEndDateTime(selectedDate);
        }
        hidePicker();
    };
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const formatTime = (d: Date) => {
        const hh = d.getHours().toString().padStart(2, '0');
        const mm = d.getMinutes().toString().padStart(2, '0');
        return `${hh}:${mm}`;
    };

    useEffect(() => {
        // При переключении между созданием и редактированием — обновлять состояние формы!
        if (editingEvent) {
            setTitle(editingEvent.title);
            setDescription(editingEvent.description || '');
            setAllDay(editingEvent.allDay);
            setStartDateTime(new Date(`${editingEvent.startDate}T${editingEvent.startTime || '00:00'}`));
            setEndDateTime(new Date(`${editingEvent.endDate || editingEvent.startDate}T${editingEvent.endTime || '23:59'}`));
            setTag(editingEvent.tag || '');
            setColor(editingEvent.color || '#007AFF');
        } else {
            setTitle('');
            setDescription('');
            setAllDay(false);
            setStartDateTime(new Date());
            setEndDateTime(new Date());
            setTag('');
            setColor('#007AFF');
        }
        // eslint-disable-next-line
    }, [eventId, events]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Ошибка', 'Введите название события');
            return;
        }
        if (startDateTime > endDateTime) {
            Alert.alert('Ошибка', 'Дата окончания не может быть раньше даты начала');
            return;
        }
        if (!allDay && startDateTime >= endDateTime) {
            Alert.alert('Ошибка', 'Время окончания должно быть позже времени начала');
            return;
        }

        // Firestore fix: нельзя undefined!
        const newEvent = {
            id: editingEvent ? editingEvent.id : '',
            title: title.trim(),
            description: description.trim(),
            startDate: formatDate(startDateTime),
            endDate: formatDate(endDateTime),
            allDay,
            ...(allDay ? {} : {
                startTime: formatTime(startDateTime),
                endTime: formatTime(endDateTime)
            }),
            tag: tag.trim() || '',
            color,
            userId: user?.uid || '',
        };

        try {
            if (editing && editingEvent) {
                await updateEvent({ ...newEvent, id: editingEvent.id });
            } else {
                await addEvent({ ...newEvent, id: '', userId: user?.uid || '' });
            }
            router.back();
        } catch (e) {
            Alert.alert('Ошибка', 'Не удалось сохранить событие. Попробуйте еще раз.');
        }
    };

    const handleCancel = () => router.back();

    const handleDelete = async () => {
        if (editing && editingEvent) {
            try {
                await deleteEvent(editingEvent.id);
                router.back();
            } catch (e) {
                Alert.alert('Ошибка', 'Не удалось удалить событие. Попробуйте еще раз.');
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{editing ? 'Редактировать событие' : 'Создать событие'}</Text>

            <Text style={styles.label}>Название события:</Text>
            <TextInput
                style={styles.input}
                placeholder="Введите название"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Описание:</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Введите описание задачи"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <View style={styles.switchContainer}>
                <Text style={styles.label}>Событие на весь день:</Text>
                <TouchableOpacity
                    style={[styles.toggleButton, { backgroundColor: allDay ? '#007AFF' : '#ccc' }]}
                    onPress={() => setAllDay((prev: any) => !prev)}
                >
                    <Text style={styles.toggleButtonText}>{allDay ? 'Да' : 'Нет'}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>Начало события</Text>
            <TouchableOpacity style={styles.pickerField} onPress={() => showPicker('start')}>
                <Text style={styles.pickerText}>
                    {allDay
                        ? `Дата: ${formatDate(startDateTime)}`
                        : `Дата и время: ${formatDate(startDateTime)} ${formatTime(startDateTime)}`}
                </Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeader}>Окончание события</Text>
            <TouchableOpacity style={styles.pickerField} onPress={() => showPicker('end')}>
                <Text style={styles.pickerText}>
                    {allDay
                        ? `Дата: ${formatDate(endDateTime)}`
                        : `Дата и время: ${formatDate(endDateTime)} ${formatTime(endDateTime)}`}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode={allDay ? 'date' : 'datetime'}
                date={currentPicker === 'start' ? startDateTime : endDateTime}
                onConfirm={handleConfirm}
                onCancel={hidePicker}
            />

            <Text style={styles.label}>Тег:</Text>
            <TextInput
                style={styles.input}
                placeholder="Например, Работа"
                value={tag}
                onChangeText={setTag}
            />

            <Text style={styles.label}>Цвет метки:</Text>
            <View style={styles.colorsContainer}>
                {['#007AFF', '#FF9500', '#34C759', '#FF3B30', '#AF52DE'].map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.colorCircle, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]}
                        onPress={() => setColor(c)}
                    />
                ))}
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{editing ? 'Сохранить' : 'Создать'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                {editing &&
                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>Удалить</Text>
                    </TouchableOpacity>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
    label: { fontSize: 16, marginVertical: 8 },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 16
    },
    switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
    toggleButton: { marginLeft: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
    toggleButtonText: { color: '#fff', fontWeight: 'bold' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 14, marginBottom: 4 },
    pickerField: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginVertical: 4 },
    pickerText: { fontSize: 16 },
    colorsContainer: { flexDirection: 'row', marginVertical: 10 },
    colorCircle: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 5, borderColor: '#000' },
    buttonRow: { flexDirection: 'row', marginTop: 24, justifyContent: 'space-between' },
    button: { flex: 1, marginHorizontal: 5, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
    saveButton: { backgroundColor: '#007AFF' },
    saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    cancelButton: { backgroundColor: '#ccc' },
    cancelButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
    deleteButton: { backgroundColor: '#FF3B30' },
    deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});