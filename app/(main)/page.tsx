import DashboardDigest from "@/app/components/ui/dashboard/DashboardDigest";
// import { dashboardDigestMock } from "@/app/lib/mockdata";
import { getDashboardKpis, getDashboardStatusCounts, getDashboardUrgentTickets } from "@/app/utils/supabase/queries";

export default async function Home() {

    const [kpis, statusCounts, urgentTickets] = await Promise.all([
        getDashboardKpis(),
        getDashboardStatusCounts(),
        getDashboardUrgentTickets(),
    ])

    console.table(kpis);
    console.log(typeof kpis.data.active_tickets);
    // console.table(statusCounts);
    // console.table(urgentTickets);
    // later, add error handling, not-found, loading state(skeleton)
    // return <DashboardDigest data={dashboardDigestMock} />;
    return (
        <div>
            <p>Hello World</p>
        </div>
    )
}