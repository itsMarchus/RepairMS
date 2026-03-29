import { Metadata } from "next";
import SettingsView from "@/app/components/ui/settings";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStoreDetails, getUserDetails } from "@/app/utils/supabase/queries";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your settings"
};

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const [userDetails, storeDetails] = await Promise.all([
        getUserDetails(user.email ?? ""),
        getStoreDetails(),
    ]);

    const userData = userDetails;
    const storeData = storeDetails;

    return (
        <SettingsView
            account={{
                fullName: userData?.full_name ?? "",
                email: user.email ?? "",
                phoneNumber: userData?.phone_number ?? "",
            }}
            store={{
                id: storeData?.id ?? "",
                shopName: storeData?.shop_name ?? "",
                physicalAddress: storeData?.physical_address ?? "",
                contactNumber: storeData?.contact_number ?? "",
            }}
        />
    );
}