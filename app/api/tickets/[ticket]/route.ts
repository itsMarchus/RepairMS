import { NextRequest, NextResponse } from "next/server";
import { TicketStatus } from "@/app/lib/definitions";
import { mockDataTicket, mockDataTicketCard, mockDataTicketDetail } from "@/app/lib/mockdata";
import { isValidStatusSlug } from "@/app/utils/statusUtils";

type UpdateTicketBody = {
    status?: TicketStatus;
    etr?: string | null;
    technician_notes?: string | null;
    payment?: {
        repair_cost?: number;
        parts_cost?: number;
        tax?: number;
        paid?: boolean;
    };
};

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ ticket: string }> },
) {
    const { ticket } = await params;

    if (!ticket) {
        return NextResponse.json(
            { error: "Ticket identifier is required." },
            { status: 400 },
        );
    }

    let body: UpdateTicketBody;
    try {
        body = (await request.json()) as UpdateTicketBody;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON payload." },
            { status: 400 },
        );
    }

    const fieldErrors: Record<string, string> = {};

    if (!body.status || !isValidStatusSlug(body.status)) {
        fieldErrors.status = "Invalid status selected.";
    }

    let parsedEtr: Date | undefined;
    if (body.etr) {
        parsedEtr = new Date(body.etr);
        if (Number.isNaN(parsedEtr.getTime())) {
            fieldErrors.etr = "Invalid estimated completion date.";
        }
    }

    const repairCost = Number(body.payment?.repair_cost ?? 0);
    const partsCost = Number(body.payment?.parts_cost ?? 0);
    const tax = Number(body.payment?.tax ?? 0);
    const paid = Boolean(body.payment?.paid);

    if (Number.isNaN(repairCost) || repairCost < 0) {
        fieldErrors.repair_cost = "Repair cost must be 0 or higher.";
    }
    if (Number.isNaN(partsCost) || partsCost < 0) {
        fieldErrors.parts_cost = "Parts cost must be 0 or higher.";
    }
    if (Number.isNaN(tax) || tax < 0) {
        fieldErrors.tax = "Tax must be 0 or higher.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return NextResponse.json(
            { error: "Validation failed.", fieldErrors },
            { status: 400 },
        );
    }

    const ticketIndex = mockDataTicket.findIndex(
        (current) => current.id === ticket || current.ticket_number === ticket,
    );

    const detailMatches =
        mockDataTicketDetail.id === ticket ||
        mockDataTicketDetail.ticket_number === ticket;

    if (ticketIndex === -1 && !detailMatches) {
        return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    const now = new Date();
    const total = repairCost + partsCost + tax;

    if (ticketIndex !== -1) {
        const target = mockDataTicket[ticketIndex];
        target.status = body.status as TicketStatus;
        target.etr = body.etr ? parsedEtr : undefined;
        target.technician_notes = body.technician_notes ?? undefined;
        target.timeline.updated_at = now;
        target.payment.repair_cost = repairCost;
        target.payment.parts_cost = partsCost;
        target.payment.tax = tax;
        target.payment.total = total;
        target.payment.paid = paid;

        const ticketCard = mockDataTicketCard.find((card) => card.id === target.id);
        if (ticketCard) {
            ticketCard.status = target.status;
            ticketCard.etr = target.etr;
            ticketCard.total_cost = total;
            ticketCard.paid = paid;
        }
    }

    if (detailMatches) {
        mockDataTicketDetail.status = body.status as TicketStatus;
        mockDataTicketDetail.etr = body.etr ? parsedEtr : undefined;
        mockDataTicketDetail.technician_notes = body.technician_notes ?? undefined;
        mockDataTicketDetail.timeline.updated_at = now;
        mockDataTicketDetail.payment.repair_cost = repairCost;
        mockDataTicketDetail.payment.parts_cost = partsCost;
        mockDataTicketDetail.payment.tax = tax;
        mockDataTicketDetail.payment.total = total;
        mockDataTicketDetail.payment.paid = paid;
    }

    const updatedTicket =
        ticketIndex !== -1
            ? mockDataTicket[ticketIndex]
            : mockDataTicketDetail;

    return NextResponse.json({ ticket: updatedTicket }, { status: 200 });
}
