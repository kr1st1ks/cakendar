import {
    CalendarKitHandle,
    DateOrDateTime,
    EventItem as CalendarEventItem,
    LocaleConfigsProps,
} from '@howljs/calendar-kit';
import {
    CalendarBody,
    CalendarContainer,
    CalendarHeader,
} from '@howljs/calendar-kit';
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    useColorScheme,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from '@/context/EventsContext';
import { EventCreateModal } from '@/components/EventCreateModal';
import { DateTime } from 'luxon';

type SearchParams = { viewMode: string; numberOfDays: string };

const MIN_DATE = DateTime.now().minus({ years: 2 }).startOf('day').toISO();
const MAX_DATE = DateTime.now().plus({ years: 2 }).startOf('day').toISO();
const INITIAL_DATE = DateTime.now().startOf('day').toISO();

const CALENDAR_THEME = {
    light: {
        colors: {
            primary: '#1a73e8',
            onPrimary: '#fff',
            background: '#fff',
            onBackground: '#000',
            border: '#dadce0',
            text: '#000',
            surface: '#ECECEC',
        },
    },
    dark: {
        colors: {
            primary: '#4E98FA',
            onPrimary: '#FFF',
            background: '#1A1B21',
            onBackground: '#FFF',
            border: '#46464C',
            text: '#FFF',
            surface: '#545454',
        },
    },
};

const initialLocales: Record<string, Partial<LocaleConfigsProps>> = {
    ru: {
        weekDayShort: 'Пн_Вт_Ср_Чт_Пт_Сб_Вс'.split('_'),
        meridiem: { ante: 'am', post: 'pm' },
    },
};

export default function CalendarScreen() {
    const { events, addEvent } = useEvents();
    const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const currentDate = useSharedValue(INITIAL_DATE);
    const params = useLocalSearchParams<SearchParams>();
    const calendarRef = useRef<CalendarKitHandle>(null);
    const [calendarWidth, setCalendarWidth] = useState(Dimensions.get('window').width);

    // Transform events to calendar format
    const calendarEvents = events.map(event => ({
        id: event.id,
        startAt: event.startAt,
        endAt: event.endAt,
        title: event.title,
        color: event.color,
        summary: event.description,
    }));

    const handleAddEvent = async (eventData: Omit<Event, 'id'>) => {
        await addEvent(eventData);
        setCreateModalVisible(false);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(DateTime.fromISO(date).toJSDate());
        setCreateModalVisible(true);
    };

    const theme = CALENDAR_THEME[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { paddingTop: safeTop }]}>
            <CalendarContainer>
                <CalendarHeader
                    theme={theme}
                />
                <CalendarBody
                    events={calendarEvents}
                    onPressDate={handleDateSelect}
                    theme={theme}
                    minDate={MIN_DATE}
                    maxDate={MAX_DATE}
                    viewMode={params.viewMode as any || 'week'}
                    locale="ru"
                    locales={initialLocales}
                    width={calendarWidth}
                    isShowHalfLine
                    dragStep={30}
                    heightByContent={false}
                    showAllDayEvents
                />
            </CalendarContainer>

            <EventCreateModal
                isVisible={isCreateModalVisible}
                selectedDate={selectedDate}
                onClose={() => setCreateModalVisible(false)}
                onAddEvent={handleAddEvent}
            />

            <TouchableOpacity
                style={[
                    styles.fab,
                    {
                        bottom: safeBottom + 16,
                        backgroundColor: theme.colors.primary,
                    }
                ]}
                onPress={() => {
                    setSelectedDate(new Date());
                    setCreateModalVisible(true);
                }}
            >
                <Ionicons name="add" size={24} color={theme.colors.onPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    fab: {
        position: 'absolute',
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
});