import { cookies } from 'next/headers';
import { formatInTimeZone } from 'date-fns-tz';

export const convertToLocalTimeReadable = async (time: Date) => {
    const cookieStore = await cookies();
    const timezoneFromCookie = cookieStore.get('timezone')?.value ?? 'UTC';
    return formatInTimeZone(time, timezoneFromCookie, 'MMM d, yyyy, h:mm a');
}