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

    return { success: true, data }
}

export const getTicketDetailsByNumber = async (ticketNumber: string) => {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.rpc('get_ticket_details_by_number', {
        p_ticket_number: ticketNumber
    })
console.log(data)
    if (error) {
        console.error('Failed to get ticket details:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}
