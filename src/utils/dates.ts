import { Days } from '../types';

export function getTodaysDay(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekDays: Days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    return weekDays[dayOfWeek];
}

export function addDaysToDate(date: string, days: number): string {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + days);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getNextDateByDay(targetDay: string): string {
    const today = new Date();
    const weekDays = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    const targetDayIndex = weekDays[targetDay];
    const currentDayIndex = today.getDay();
    const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;

    const nextTargetDate = new Date(today);
    nextTargetDate.setDate(today.getDate() + daysUntilTarget);

    const year = nextTargetDate.getFullYear();
    const month = String(nextTargetDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextTargetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
