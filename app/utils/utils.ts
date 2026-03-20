import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const formatMoney = (value: number) =>
    value.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
});

export const cleanFileName = (deviceType: string, deviceBrand: string, fileName: string) => {
    const fileExt = fileName.split('.').pop();
    const cleanDeviceType = deviceType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const cleanDeviceBrand = deviceBrand.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const cleanFileName = `${cleanDeviceType}_${cleanDeviceBrand}_${Date.now()}.${fileExt}`;
    return cleanFileName;
}