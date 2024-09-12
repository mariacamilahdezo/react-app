import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// Function to format a date with a given format and time zone
export function formatDate(date, formatStr, timeZone = 'America/Bogota') {
	const zonedDate = utcToZonedTime(date, timeZone);
	return format(zonedDate, formatStr);
}

// Function to calculate and format the date three months ago
export function calculateDateInterval(monthsAgo) {
	const today = new Date();
	const intervalDate = new Date(today.setMonth(today.getMonth() - monthsAgo));
	return intervalDate.toISOString().split('T')[0]; // Formats the date as "YYYY-MM-DD"
}
