// types/index.ts
export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    startTime: string; // ISO-строка или формат YYYY-MM-DD для событий на весь день
    endTime: string;   // ISO-строка или формат YYYY-MM-DD для событий на весь день
    tag: string;
    color: string;
    allDay: boolean;
}