import SettingsView from "@/app/components/ui/settings";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStoreDetails, getUserDetails,  } from "@/app/utils/supabase/queries";

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

    const { data: userData, success: userSuccess } = userDetails;
    const { data: storeData, success: storeSuccess } = storeDetails;

    if (!userSuccess) {
        console.error("Failed to fetch user details:");
    }

    if (!storeSuccess) {
        console.error("Failed to fetch store details:");
    }

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