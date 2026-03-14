"use client";

import { notFound } from "next/navigation";
// import { Suspense } from "react"; // this shows the loading state for better UX
import { Button } from '@/app/components/reusable/button';
import { Card } from '@/app/components/reusable/card';
import { Badge } from '@/app/components/reusable/badge';
import { Textarea } from '@/app/components/reusable/textarea';
import { Input } from '@/app/components/reusable/input';
import { Label } from '@/app/components/reusable/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/reusable/select';
import { ArrowLeft, Phone, Mail, Camera, QrCode, DollarSign, Save } from 'lucide-react';
import { getTicketAlertLevel, getTimeUntilDeadline } from '@/app/utils/ticketUtils';
import { toast } from 'sonner';
import { useState, useEffect } from 'react'; // using useEffect for mock data fetch and probably later will instead use a promise to fetch to the server side
import { TicketType } from '@/app/lib/definitions';

export default async function TicketDetails({ params } : { params: Promise<{ ticket_number: string }>}) {

    const { ticket_number } = await params;

    const [ticket, setTicket] = useState<TicketType | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    if (!ticket_number || !ticket) {
        notFound();
    } // TODO: add not-found.tsx

    const alertLevel = getTicketAlertLevel(ticket);

    const handleSave = () => {
        toast.success('Ticket updated successfully');
        setIsEditing(false);
        // TODO: update ticket in the database
    }

    const alertBorders = {
        normal: 'border-gray-200',
        warning: 'border-yellow-400 border-2',
        danger: 'border-red-400 border-2'
    };

    return (
        <div>
            <h1>Ticket</h1>
        </div>
    )
}