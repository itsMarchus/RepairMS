'use server'

import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { TicketStatus } from '@/app/lib/definitions';

const getSupabase = async () => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    return { cookieStore, supabase };
};

export const getTicketsByStatus = async (status: TicketStatus) => {
    try {
        const { supabase } = await getSupabase();
        const { data, error } = await supabase.rpc('get_tickets_by_status', {
            p_status: status
        });

        if (error) {
            console.error('Supabase Error (get_tickets_by_status):', error);
            throw new Error('Failed to fetch tickets.');
        }

        return data ?? [];
    } catch (error) {
        console.error('Database Error (getTicketsByStatus):', error);
        throw new Error('Failed to fetch tickets.');
    }
}

export const getTicketDetailsByNumber = async (ticketNumber: string) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_ticket_details_by_number', {
        p_ticket_number: ticketNumber
    })

    if (error) {
        console.error('Failed to get ticket details:', error)
        return { success: false, error: error.message }
    }

    const photoName = data[0]?.photo;
    if (!photoName || photoName === null) {
        return { success: true, data: data[0] }
    }

    const { data: photoData, error: photoError } = await supabase.storage
        .from('device-photos')
        .createSignedUrl(photoName, 60 * 30);
        
    if (photoError) {
        console.error('Failed to get photo:', photoError)
        return { success: true, data: data[0] }
    }

    const updatedData = { ...data[0], photo: photoData.signedUrl }

    return { success: true, data: updatedData }
}

export const getTicketCheckoutDetails = async (ticketNumber: string) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_ticket_checkout_details', {
        p_ticket_number: ticketNumber
    })
    
    if (error) {
        console.error('Failed to get ticket checkout details:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
}

export const getTicketPortalDetails = async (ticketNumber: string) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_ticket_in_portal', {
        p_ticket_number: ticketNumber
    })

    if (error) {
        console.error('Failed to get ticket portal details:', error)
        return { success: false, error: error.message }
    }

    if (!data || data.length === 0 || !data[0]) {
        return { success: false, error: "Ticket not found." };
    }

    return { success: true, data: data[0] }
}

export const getStoreDetails = async () => {
    try {
        const { supabase } = await getSupabase();
        const { data, error } = await supabase.rpc('get_store_details');

        if (error) {
            console.error('Supabase Error (get_store_details):', error);
            throw new Error('Failed to fetch store details.');
        }

        return data?.[0] ?? null;
    } catch (error) {
        console.error('Database Error (getStoreDetails):', error);
        throw new Error('Failed to fetch store details.');
    }
}

export const getUserDetails = async (email: string) => {
    try {
        const { supabase } = await getSupabase();
        const { data, error } = await supabase.rpc('get_profile_by_email', {
            p_email: email
        });

        if (error) {
            console.error('Supabase Error (get_profile_by_email):', error);
            throw new Error('Failed to fetch user profile.');
        }

        return data?.[0] ?? null;
    } catch (error) {
        console.error('Database Error (getUserDetails):', error);
        throw new Error('Failed to fetch user profile.');
    }
}

export const getDashboardKpis = async () => {
    try {
        const { cookieStore, supabase } = await getSupabase();
        const timezone = cookieStore.get('timezone')?.value ?? 'Asia/Manila';
        const { data, error } = await supabase.rpc('get_dashboard_kpis', {
            p_timezone: timezone
        });

        if (error) {
            console.error('Supabase Error (get_dashboard_kpis):', error);
            throw new Error('Failed to fetch dashboard KPI data.');
        }

        return data?.[0] ?? {
            active_tickets: 0,
            ready_for_pickup: 0,
            due_soon: 0,
            overdue: 0,
            unpaid_pickup: 0,
            created_today: 0,
            completed_today: 0,
            revenue_today: 0,
        };
    } catch (error) {
        console.error('Database Error (getDashboardKpis):', error);
        throw new Error('Failed to fetch dashboard KPI data.');
    }
}

export const getDashboardStatusCounts = async () => {
    try {
        const { supabase } = await getSupabase();
        const { data, error } = await supabase.rpc('get_dashboard_status_counts');

        if (error) {
            console.error('Supabase Error (get_dashboard_status_counts):', error);
            throw new Error('Failed to fetch dashboard status counts.');
        }

        return data?.[0] ?? {
            queued: 0,
            diagnosing: 0,
            waiting_for_parts: 0,
            repairing: 0,
            pickup: 0,
            completed: 0,
        };
    } catch (error) {
        console.error('Database Error (getDashboardStatusCounts):', error);
        throw new Error('Failed to fetch dashboard status counts.');
    }
}

export const getDashboardUrgentTickets = async () => {
    try {
        const { supabase } = await getSupabase();
        const { data, error } = await supabase.rpc('get_dashboard_urgent_tickets');

        if (error) {
            console.error('Supabase Error (get_dashboard_urgent_tickets):', error);
            throw new Error('Failed to fetch urgent ticket cards.');
        }

        return data ?? [];
    } catch (error) {
        console.error('Database Error (getDashboardUrgentTickets):', error);
        throw new Error('Failed to fetch urgent ticket cards.');
    }
}