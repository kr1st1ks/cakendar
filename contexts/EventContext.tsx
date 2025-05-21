import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';

// Тип события с обязательным userId
export type Event = {
    id?: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    startTime?: string;
    endTime?: string;
    tag?: string;
    color?: string;
    userId: string;
};

type EventsContextType = {
    events: Event[];
    addEvent: (event: Omit<Event, 'id' | 'userId'>) => Promise<void>;
    updateEvent: (event: Event) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Хук для доступа к событиям
export const useEvents = () => {
    const ctx = useContext(EventsContext);
    if (!ctx) throw new Error('useEvents must be used within EventProvider');
    return ctx;
};

const STORAGE_KEY = 'events';

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const { user } = useAuth();

    // Подписка на события только текущего пользователя
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        if (user?.uid) {
            const q = query(collection(db, 'events'), where('userId', '==', user.uid));
            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const userEvents: Event[] = [];
                    snapshot.forEach((docSnap) => {
                        const data = docSnap.data() as Omit<Event, 'id'>;
                        // Гарантируем userId всегда присвоен
                        userEvents.push({ id: docSnap.id, ...data, userId: data.userId });
                    });
                    setEvents(userEvents);
                    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userEvents)).catch((err) =>
                        console.error('Ошибка сохранения событий в AsyncStorage:', err)
                    );
                },
                (error) => {
                    console.error('Ошибка подписки на события:', error);
                }
            );
        } else {
            AsyncStorage.getItem(STORAGE_KEY)
                .then((stored) => {
                    if (stored) setEvents(JSON.parse(stored));
                })
                .catch((err) => {
                    console.error('Ошибка загрузки событий из AsyncStorage:', err);
                });
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);


    // Добавление события
    function removeUndefinedFields<T extends object>(obj: T): T {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
    }

    const addEvent = async (event: Omit<Event, 'id' | 'userId'>) => {
        if (!user?.uid) return;
        const newEvent = removeUndefinedFields({ ...event, userId: user.uid });
        await addDoc(collection(db, 'events'), newEvent);
    };

    // Обновление события
    const updateEvent = async (event: Event) => {
        if (!user?.uid || !event.id) return;
        try {
            await updateDoc(doc(db, 'events', event.id), { ...event, userId: user.uid });
        } catch (err) {
            console.error('Ошибка обновления события:', err);
        }
    };

    // Удаление события
    const deleteEvent = async (eventId: string) => {
        if (!user?.uid || !eventId) return;
        try {
            await deleteDoc(doc(db, 'events', eventId));
        } catch (err) {
            console.error('Ошибка удаления события:', err);
        }
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
            {children}
        </EventsContext.Provider>
    );
};
