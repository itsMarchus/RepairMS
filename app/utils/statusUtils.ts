import { TicketStatus } from "../lib/definitions";

export const statusSlugMap: Record<TicketStatus, string> = {
    "queued": "Queued",
    "diagnosing": "Diagnosing",
    "waiting-for-parts": "Waiting for Parts",
    "repairing": "Repairing",
    "pickup": "Ready for Pickup",
    "completed": "Completed",
};

export const statusToSlugMap: Record<string, TicketStatus> = {
    "Queued": "queued",
    "Diagnosing": "diagnosing",
    "Waiting for Parts": "waiting-for-parts",
    "Repairing": "repairing",
    "Ready for Pickup": "pickup",
    "Completed": "completed",
};

export const validStatusSlugs = Object.keys(statusSlugMap);

export function getStatusFromSlug(slug: TicketStatus): string | null {
    return statusSlugMap[slug] || null;
}

export function getSlugFromStatus(status: TicketStatus): string {
    return statusToSlugMap[status];
}

export function isValidStatusSlug(slug: string): boolean {
    return slug in statusSlugMap;
}
