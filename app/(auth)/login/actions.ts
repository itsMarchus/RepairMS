"use server";

import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LOGIN_ROUTE = "/login";
const DEFAULT_REDIRECT = "/";

const encodeMessage = (message: string) => encodeURIComponent(message);
const safeRedirectPath = (input: string) =>
    input.startsWith("/") ? input : DEFAULT_REDIRECT;

export async function loginWithPassword(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const next = safeRedirectPath(String(formData.get("next") ?? DEFAULT_REDIRECT));

    if (!email || !password) {
        redirect(`${LOGIN_ROUTE}?error=${encodeMessage("Email and password are required.")}`);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect(`${LOGIN_ROUTE}?error=${encodeMessage(error.message)}`);
    }

    redirect(next);
}
