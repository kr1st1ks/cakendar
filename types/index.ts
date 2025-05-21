export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    tag: string;
    color: string;
    allDay: boolean;
    userId: string; // добавь это поле!
}