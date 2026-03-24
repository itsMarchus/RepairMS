"use client";

import { useEffect } from "react";

export default function TimezoneSetter() {
    useEffect(() => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        document.cookie = `timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`; 
    }, []);

    return null;
}