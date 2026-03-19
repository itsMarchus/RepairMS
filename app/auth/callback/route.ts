import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/";
    const redirectUrl = new URL(next, request.url);

    if (!code) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", "Missing confirmation code.");
        return NextResponse.redirect(loginUrl);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("error", error.message);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(redirectUrl);
}
