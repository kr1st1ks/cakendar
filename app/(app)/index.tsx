// File: app/(app)/index.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useEvents } from '../../contexts/EventContext';
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from '../../contexts/AuthContext'; // добавь если нужно
import FAB from '../../components/FAB';

// Определяем тип события (расширенный)
export type Event = {
    id: string;
    title: string;
    description: string;
    startDate: string;   // Формат: 'YYYY-MM-DD'
    endDate?: string;    // Если событие длится несколько дней
    allDay: boolean;     // Событие на весь день (true/false)
    startTime?: string;  // Если событие не на весь день, время начала
    endTime?: string;    // Если событие не на весь день, время окончания
    tag?: string;        // Тег события
    color?: string;      // Цвет метки (например, '#007AFF')
    userId?: string;     // Для идентификации пользователя
};

// Функция для получения всех дат в диапазоне от start до end (включительно)
const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export default function CalendarScreen() {
    const router = useRouter();
    const { events, deleteEvent } = useEvents();
    const { showWeekNumbers } = useSettings();
    const { user } = useAuth();

    // Выбранная дата (по умолчанию — сегодня)
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    // Состояние для отметок (markedDates) в календаре
    const [markedDates, setMarkedDates] = useState<any>({});

    // Используем multi-period marking:
    // Для каждого события создаём периоды для всех дат, на которые оно приходится.
    useEffect(() => {
        const marks: any = {};

        // ! Оставляем только события текущего пользователя
        const filteredEvents = user
            ? events.filter(e => e.userId === user.uid)
            : [];

        filteredEvents.forEach((event) => {
            const color = event.color || '#007AFF';
            // Если многодневное событие: если endDate существует и отличается от startDate
            if (event.endDate && event.startDate !== event.endDate) {
                const dates = getDatesInRange(event.startDate, event.endDate);
                dates.forEach((date, index) => {
                    const period = {
                        startingDay: index === 0,
                        endingDay: index === dates.length - 1,
                        color,
                        textColor: '#fff',
                    };
                    if (marks[date]) {
                        marks[date].periods.push(period);
                    } else {
                        marks[date] = { periods: [period] };
                    }
                });
            } else {
                // Однодневное событие
                const period = {
                    startingDay: true,
                    endingDay: true,
                    color,
                    textColor: '#fff',
                };
                if (marks[event.startDate]) {
                    marks[event.startDate].periods.push(period);
                } else {
                    marks[event.startDate] = { periods: [period] };
                }
            }
        });

        // Выделяем выбранную дату
        if (marks[selectedDate]) {
            marks[selectedDate] = {
                ...marks[selectedDate],
                selected: true,
                selectedColor: '#007AFF',
            };
        } else {
            marks[selectedDate] = {
                selected: true,
                selectedColor: '#007AFF',
            };
        }

        setMarkedDates(marks);
    }, [events, selectedDate, user]);

    // Фильтрация событий для выбранной даты.
    // Для многодневных событий: если выбранная дата входит в диапазон.
    const eventsForDate = user
        ? events.filter((event) => {
            if (event.userId !== user.uid) return false;
            if (!event.endDate || event.startDate === event.endDate) {
                return event.startDate === selectedDate;
            }
            return selectedDate >= event.startDate && selectedDate <= event.endDate;
        })
        : [];

    // При нажатии на событие показываем алерт со списком всех событий на выбранную дату.
    const handleEventPress = () => {
        if (eventsForDate.length === 0) return;
        const list = eventsForDate
            .map(
                (evt) =>
                    `${evt.title} ${evt.allDay ? '(Весь день)' : `(${evt.startTime || ''} - ${evt.endTime || ''})`}`
            )
            .join('\n');
        Alert.alert(`События на ${selectedDate}`, list);
    };

    // Обработчик удаления события (при долгом нажатии)
    const handleDeleteEvent = (id: string) => {
        Alert.alert('Удалить событие', 'Вы уверены, что хотите удалить это событие?', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Удалить', style: 'destructive', onPress: () => deleteEvent(id) },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Календарь с Multi-Period marking */}
            <Calendar
                current={selectedDate}
                onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                showWeekNumbers={showWeekNumbers}
                markingType="multi-period"
                theme={{
                    backgroundColor: '#fff',
                    calendarBackground: '#fff',
                    textSectionTitleColor: '#007AFF',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#007AFF',
                    dayTextColor: '#000',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#007AFF',
                    selectedDotColor: '#fff',
                    arrowColor: '#007AFF',
                    monthTextColor: '#007AFF',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 14,
                }}
            />

            {/* Секция списка событий */}
            <View style={styles.eventsContainer}>
                <Text style={styles.eventsHeader}>События на {selectedDate}</Text>
                {eventsForDate.length === 0 ? (
                    <Text style={styles.noEventsText}>Нет событий на эту дату</Text>
                ) : (
                    <FlatList
                        data={eventsForDate}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.eventItem, { borderLeftColor: item.color || '#007AFF' }]}
                                onPress={() => router.push(`/(app)/event-form/${item.id}`)}
                                onLongPress={() => handleDeleteEvent(item.id)}
                            >
                                <Text style={styles.eventTitle}>{item.title}</Text>
                                <Text style={styles.eventTime}>
                                    {item.allDay ? 'Весь день' : `${item.startTime || ''} - ${item.endTime || ''}`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
            <FAB onPress={() => router.push(`/(app)/event-form/new`)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    eventsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    eventsHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
    },
    noEventsText: {
        fontStyle: 'italic',
        color: '#888',
    },
    eventItem: {
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 5,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    eventTime: {
        fontSize: 14,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#007AFF',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
});