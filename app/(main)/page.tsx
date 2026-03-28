import DashboardDigest from "@/app/components/ui/dashboard/DashboardDigest";
import { dashboardDigestMock } from "@/app/lib/mockdata";

export default function Home() {
    return <DashboardDigest data={dashboardDigestMock} />;
}