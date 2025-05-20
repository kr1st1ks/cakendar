// File: context/EventsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Определяем тип события с расширенными полями
export type Event = {
    id: string;
    title: string;
    description: string;
    startDate: string;          // Дата начала события в формате 'YYYY-MM-DD'
    endDate?: string;           // Дата окончания (если событие длится более одного дня)
    allDay: boolean;            // Флаг: событие на весь день
    startTime?: string;         // Время начала (если событие не на весь день)
    endTime?: string;           // Время окончания (если событие не на весь день)
    tag?: string;               // Тег события (например, 'Работа', 'Личное' и т.д.)
    color?: string;             // Цвет метки (например, '#007AFF')
};

type EventsContextType = {
    events: Event[];
    addEvent: (event: Event) => void;
    updateEvent: (updatedEvent: Event) => void;
    deleteEvent: (eventToDelete: Event) => void;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
    const ctx = useContext(EventsContext);
    if (!ctx) {
        throw new Error('useEvents must be used within EventsProvider');
    }
    return ctx;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Начальный список событий, загружаемый из AsyncStorage
    const [events, setEvents] = useState<Event[]>([]);

    // Ключ для AsyncStorage
    const STORAGE_KEY = 'events';

    // Функция загрузки событий из AsyncStorage
    const loadEvents = async () => {
        try {
            const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedEvents) {
                setEvents(JSON.parse(storedEvents));
            }
        } catch (error) {
            console.error('Ошибка загрузки событий из AsyncStorage:', error);
        }
    };

    // Функция сохранения событий в AsyncStorage
    const saveEvents = async (eventsToSave: Event[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToSave));
        } catch (error) {
            console.error('Ошибка сохранения событий в AsyncStorage:', error);
        }
    };

    // При монтировании загружаем события из AsyncStorage
    useEffect(() => {
        loadEvents();
    }, []);

    // При каждом изменении списка событий сохраняем их в AsyncStorage
    useEffect(() => {
        saveEvents(events);
    }, [events]);

    // Функция добавления нового события в список
    const addEvent = (event: Event) => {
        setEvents((prev) => [...prev, event]);
    };

    // Функция обновления события:
    // Ищет событие по id и заменяет его обновлённым объектом
    const updateEvent = (updatedEvent: Event) => {
        setEvents((prev) =>
            prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
    };

    // Функция удаления события:
    // Удаляет событие с заданным id из списка
    const deleteEvent = (eventToDelete: Event) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventToDelete.id));
    };

    const value: EventsContextType = { events, addEvent, updateEvent, deleteEvent };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
};