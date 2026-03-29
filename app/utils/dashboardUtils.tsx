import { DashboardKpi, DashboardStatusCount } from "../lib/definitions";

export const mapDashboardKpis = (rawKpis: {
    active_tickets: number;
    ready_for_pickup: number;
    due_soon: number;
    overdue: number;
    unpaid_pickup: number;
    created_today: number;
    completed_today: number;
    revenue_today: number;
}) => {
    
    const kpis = [
        {
            id: "active_tickets",
            label: "Active Tickets",
            hint: "Across queued to pickup",
            tone: "default",
        },
        {
            id: "ready_for_pickup",
            label: "Ready for Pickup",
            hint: "Awaiting customer claim",
            tone: "success",
        },
        {
            id: "due_soon",
            label: "Due Soon",
            hint: "Expected within 6 hours",
            tone: "warning",
        },
        {
            id: "overdue",
            label: "Overdue",
            hint: "Past estimated completion",
            tone: "danger",
        },
        {
            id: "unpaid_pickup",
            label: "Unpaid Pickup",
            hint: "Pickup tickets with pending payment",
            tone: "warning",
        },
        {
            id: "created_today",
            label: "Created Today",
            hint: "New tickets logged today",
            tone: "default",
        },
    ] as DashboardKpi[];

    const mappedKpis = kpis.map((kpi) => ({
        ...kpi,
        value: rawKpis?.[kpi.id as keyof typeof rawKpis],
    }));

    const activity = {
        createdToday: rawKpis?.created_today,
        completedToday: rawKpis?.completed_today,
        revenueToday: rawKpis?.revenue_today,
        unpaidPickup: rawKpis?.unpaid_pickup,
    };

    return { mappedKpis, activity};
}

export const mapDashboardStatusCounts = (rawStatusCounts: {
    queued: number;
    diagnosing: number;
    waiting_for_parts: number;
    repairing: number;
    pickup: number;
    completed: number;
}) => {

    const statusCounts = [
        {
            status: "queued",
            label: "Queued",
            count: rawStatusCounts?.queued,
            href: "/queued",
            icon: "🔄",
        },
        {
            status: "diagnosing",
            label: "Diagnosing",
            count: rawStatusCounts?.diagnosing,
            href: "/diagnosing",
            icon: "🔍",
        },
        {
            status: "waiting-for-parts",
            label: "Waiting for Parts",
            count: rawStatusCounts?.waiting_for_parts,
            href: "/waiting-for-parts",
            icon: "📦",
        },
        {
            status: "repairing",
            label: "Repairing",
            count: rawStatusCounts?.repairing,
            href: "/repairing",
            icon: "🔧",
        },
        {
            status: "pickup",
            label: "Ready for Pickup",
            count: rawStatusCounts?.pickup,
            href: "/pickup",
            icon: "✅",
        },
        {
            status: "completed",
            label: "Completed",
            count: rawStatusCounts?.completed,
            href: "/completed",
            icon: "✓✓",
        },
    ] as DashboardStatusCount[];
    

    return statusCounts;
}