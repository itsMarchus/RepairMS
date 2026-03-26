import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TimezoneSetter from "@/app/(auth)/login/timezone";
import LoginGateway from "@/app/(auth)/login/LoginGateway";

interface LoginPageProps {
    searchParams: Promise<{
        error?: string;
        next?: string;
    }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();

    if (data.user) {
        redirect("/");
    }

    const { error, next } = await searchParams;
    const nextPath = next && next.startsWith("/") ? next : "/";

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <TimezoneSetter />
            <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6">
                <LoginGateway nextPath={nextPath} error={error} />
            </div>
        </main>
    );
}