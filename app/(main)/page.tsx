import DashboardDigest from "@/app/components/ui/dashboard/DashboardDigest";
import { getDashboardKpis, getDashboardStatusCounts, getDashboardUrgentTickets } from "@/app/utils/supabase/queries";
import { mapDashboardKpis, mapDashboardStatusCounts } from "@/app/utils/dashboardUtils";

export default async function Home() {

    const [rawKpis, statusCounts, urgentTickets] = await Promise.all([
        getDashboardKpis(),
        getDashboardStatusCounts(),
        getDashboardUrgentTickets(),
    ])

    const { mappedKpis, activity } = mapDashboardKpis(rawKpis);
    const mappedStatusCounts = mapDashboardStatusCounts(statusCounts);

    return <DashboardDigest  kpis={mappedKpis} statusCounts={mappedStatusCounts} urgentTickets={urgentTickets} activity={activity} />;
}