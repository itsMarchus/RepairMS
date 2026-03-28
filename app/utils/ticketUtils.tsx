import { TicketStatus } from "../lib/definitions";

type DeadlineInput = Date | string | null | undefined;

const toValidDate = (value: DeadlineInput): Date | null => {
    if (!value) {
        return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getTicketAlertLevel = ({
    est_time_repair,
    status,
}: {
    est_time_repair: DeadlineInput;
    status: TicketStatus;
}): "normal" | "warning" | "danger" => {
    if (status === 'completed' || status === 'pickup') {
        return 'normal';
    }

    const deadline = toValidDate(est_time_repair);
    if (!deadline) {
        return "normal";
    }

    const now = new Date();
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 0) {
      return 'danger'; // Overdue
    } else if (hoursUntilDeadline <= 6) {
      return 'warning'; // Within 5 hours of deadline
    }

    return 'normal';
};

export const getTimeUntilDeadline = (deadlineInput: DeadlineInput): string => {
    const deadline = toValidDate(deadlineInput);

    if (!deadline) {
        return 'No deadline';
    }

    const now = new Date();
    const diff = deadline.valueOf() - now.valueOf();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) {
        return `Overdue by ${Math.abs(hours)}h ${Math.abs(minutes)}m`;
    }

    if (hours === 0) {
        return `${minutes}m remaining`;
    }

    return `${hours}h ${minutes}m remaining`;
};