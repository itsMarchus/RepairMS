'use server'

import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
import { TicketStatus } from '@/app/lib/definitions';

export const getTicketsByStatus = async (status: TicketStatus) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_tickets_by_status', {
        p_status: status
    })

    if (error) {
        console.error('Failed to get tickets:', error)
        return { success: false, error: error.message }
    }

    return { data };
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_store_details');

    if (error) {
        console.error('Failed to get store details:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: data[0] };
}

export const getUserDetails = async (email: string) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_profile_by_email', {
        p_email: email
    });

    if (error) {
        console.error('Failed to get user details:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: data[0] };
}

export const getDashboardKpis = async () => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const timezone = cookieStore.get('timezone')?.value ?? 'Asia/Manila';

    const { data, error } = await supabase.rpc('get_dashboard_kpis', {
        p_timezone: timezone
    })

    if (error) {
        console.error('Failed to get dashboard kpis:', error)
        return { success: false, error: error.message }
    }

    return { data: data[0] }
}

export const getDashboardStatusCounts = async () => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_dashboard_status_counts');

    if (error) {
        console.error('Failed to get dashboard status counts:', error)
        return { success: false, error: error.message }
    }

    return { data: data[0] }
}

export const getDashboardUrgentTickets = async () => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_dashboard_urgent_tickets');

    if (error) {
        console.error('Failed to get dashboard urgent tickets:', error)
        return { success: false, error: error.message }
    }

    return { data: data[0] }
}