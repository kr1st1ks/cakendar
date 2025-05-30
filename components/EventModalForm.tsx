// File: components/EventModalForm.tsx
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Dimensions,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Event } from '../contexts/EventContext';

type Props = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    editingEvent?: Event | null;
    onSave: (evt: Event) => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EventModalForm({
                                           modalVisible,
                                           setModalVisible,
                                           editingEvent,
                                           onSave,
                                       }: Props) {
    const initialDate = editingEvent ? new Date(editingEvent.startDate) : new Date();

    const [title, setTitle] = useState(editingEvent ? editingEvent.title : '');
    const [description, setDescription] = useState(editingEvent ? editingEvent.description || '' : '');
    const [allDay, setAllDay] = useState(editingEvent ? editingEvent.allDay : false);
    const [startDateTime, setStartDateTime] = useState<Date>(initialDate);
    const [endDateTime, setEndDateTime] = useState<Date>(initialDate);
    const [tag, setTag] = useState(editingEvent ? editingEvent.tag || '' : '');
    const [color, setColor] = useState<string>(editingEvent ? editingEvent.color || '#007AFF' : '#007AFF');

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentPicker, setCurrentPicker] = useState<'start' | 'end' | null>(null);

    useEffect(() => {
        if (modalVisible) {
            if (editingEvent) {
                setTitle(editingEvent.title);
                setDescription(editingEvent.description || '');
                setAllDay(editingEvent.allDay);
                setStartDateTime(new Date(editingEvent.startDate));
                setEndDateTime(editingEvent.endDate ? new Date(editingEvent.endDate) : new Date(editingEvent.startDate));
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
        }
    }, [modalVisible, editingEvent]);

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

    const handleSave = () => {
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

        const evt: Event = {
            id: editingEvent ? editingEvent.id : Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            startDate: formatDate(startDateTime),
            endDate: formatDate(endDateTime),
            allDay,
            startTime: allDay ? undefined : formatTime(startDateTime),
            endTime: allDay ? undefined : formatTime(endDateTime),
            tag: tag.trim(),
            color,
        };

        onSave(evt);
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    // Обработчик жеста: если пользователь смахнет вниз на более чем 100 пикселей, закроем окно
    const onGestureEvent = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationY > 100) {
                setModalVisible(false);
            }
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(false);
            }}
        >
            <PanGestureHandler onHandlerStateChange={onGestureEvent}>
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.header}>
                            {editingEvent ? 'Редактировать событие' : 'Создать событие'}
                        </Text>

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
                                onPress={() => setAllDay(prev => !prev)}
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

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>
                                {editingEvent ? 'Сохранить изменения' : 'Сохранить событие'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Отмена</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </PanGestureHandler>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode={allDay ? 'date' : 'datetime'}
                onConfirm={handleConfirm}
                onCancel={hidePicker}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        // Выравнивание содержимого по нижней части экрана
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        width: '100%',
        // Высота окна: можно задать процент или фиксированное значение
        height: '70%',
    },
    header: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        color: '#000',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    toggleButton: {
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 15,
        marginBottom: 5,
        color: '#007AFF',
    },
    pickerField: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
    },
    pickerText: {
        fontSize: 16,
        color: '#007AFF',
    },
    colorsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    cancelButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
});