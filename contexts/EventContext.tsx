// contexts/EventContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';

export type Event = {
    id: string;
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

type EventContextType = {
    events: Event[];
    addEvent: (event: Event) => Promise<void>;
    updateEvent: (event: Event) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
    const ctx = useContext(EventContext);
    if (!ctx) throw new Error('useEvents must be used within EventProvider');
    return ctx;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const { user } = useAuth();

    // Подписка на Firestore события текущего пользователя
    useEffect(() => {
        if (!user?.uid) {
            setEvents([]);
            return;
        }
        const q = query(collection(db, 'events'), where('userId', '==', user.uid));
        const unsub = onSnapshot(
            q,
            (snapshot) => {
                const list: Event[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    list.push({
                        id: docSnap.id,
                        title: data.title,
                        description: data.description,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        allDay: data.allDay,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        tag: data.tag,
                        color: data.color,
                        userId: data.userId,
                    });
                });
                setEvents(list);
                AsyncStorage.setItem('events', JSON.stringify(list)).catch(() => {});
            },
            (err) => {
                setEvents([]);
            }
        );
        return () => unsub();
    }, [user?.uid]);

    // CRUD-методы

    const addEvent = async (event: Event) => {
        if (!user?.uid) throw new Error('Нет пользователя');
        // Убираем id (Firestore создаёт свой id)
        const data = {
            ...event,
            id: undefined,
            userId: user.uid,
            tag: event.tag || '',
            color: event.color || '#007AFF',
            endDate: event.endDate || event.startDate,
            startTime: event.allDay ? undefined : event.startTime,
            endTime: event.allDay ? undefined : event.endTime,
        };
        // Firestore не любит undefined
        const firestoreData: any = {};
        Object.keys(data).forEach((k) => {
            if (typeof data[k] !== 'undefined') firestoreData[k] = data[k];
        });
        await addDoc(collection(db, 'events'), firestoreData);
    };

    const updateEvent = async (event: Event) => {
        if (!user?.uid) throw new Error('Нет пользователя');
        const eventRef = doc(db, 'events', event.id);
        // Firestore не любит undefined
        const firestoreData: any = {};
        Object.keys(event).forEach((k) => {
            if (typeof event[k] !== 'undefined') firestoreData[k] = event[k];
        });
        await updateDoc(eventRef, firestoreData);
    };

    const deleteEvent = async (id: string) => {
        if (!user?.uid) throw new Error('Нет пользователя');
        await deleteDoc(doc(db, 'events', id));
    };

    return (
        <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
            {children}
        </EventContext.Provider>
    );
};