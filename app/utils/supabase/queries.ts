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
