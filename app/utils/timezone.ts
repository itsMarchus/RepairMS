import { cookies } from 'next/headers';
import { formatInTimeZone } from 'date-fns-tz';

export const convertToLocalTimeReadable = async (time: Date, format: string = 'MMM d, yyyy, h:mm a') => {
    const cookieStore = await cookies();
    const timezoneFromCookie = cookieStore.get('timezone')?.value ?? 'Asia/Manila';
    return formatInTimeZone(time, timezoneFromCookie, format);
}