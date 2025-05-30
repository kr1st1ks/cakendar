// File: utils/scheduleUtils.ts
/**
 * Группирует события по дате. Если событие многодневное (есть endDate),
 * оно добавляется во все даты диапазона.
 */
export function groupEventsByDay(events: any[]): { [date: string]: any[] } {
    const grouped: { [date: string]: any[] } = {};
    events.forEach(event => {
        if (event.endDate && event.endDate !== event.startDate) {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            let current = new Date(start);
            while (current <= end) {
                const dateStr = current.toISOString().split('T')[0];
                if (!grouped[dateStr]) grouped[dateStr] = [];
                grouped[dateStr].push(event);
                current.setDate(current.getDate() + 1);
            }
        } else {
            if (!grouped[event.startDate]) grouped[event.startDate] = [];
            grouped[event.startDate].push(event);
        }
    });
    return grouped;
}