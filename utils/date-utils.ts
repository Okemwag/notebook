import { format, isAfter, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Formats a match date into a human-readable string
 * Examples: "Today", "Tomorrow", "Mon, Oct 5", "Fri, Dec 25"
 */
export function formatMatchDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  }

  return format(dateObj, 'EEE, MMM d');
}

/**
 * Formats a match time into a human-readable string
 * Example: "3:00 PM", "10:30 AM"
 */
export function formatMatchTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

/**
 * Checks if a match has already started
 * Returns true if the current time is after the match start time
 */
export function isMatchStarted(matchDateTime: Date | string): boolean {
  const dateObj = typeof matchDateTime === 'string' ? parseISO(matchDateTime) : matchDateTime;
  const now = new Date();
  return isAfter(now, dateObj);
}

/**
 * Formats a full match date and time
 * Example: "Today at 3:00 PM", "Tomorrow at 10:30 AM", "Mon, Oct 5 at 7:00 PM"
 */
export function formatMatchDateTime(date: Date | string): string {
  return `${formatMatchDate(date)} at ${formatMatchTime(date)}`;
}
