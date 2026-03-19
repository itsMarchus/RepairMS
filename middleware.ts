import { updateSession } from "@/app/utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/auth"];

const copyCookies = (source: NextResponse, target: NextResponse) => {
    source.cookies.getAll().forEach((cookie) => {
        target.cookies.set(cookie);
    });
};

export async function middleware(request: NextRequest) {
    const { response, user } = await updateSession(request);
    const { pathname, search } = request.nextUrl;
    const isAuthPath = AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (!user && !isAuthPath) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("next", `${pathname}${search}`);
        const redirectResponse = NextResponse.redirect(loginUrl);
        copyCookies(response, redirectResponse);
        return redirectResponse;
    }

    if (user && pathname === "/login") {
        const nextPath = request.nextUrl.searchParams.get("next");
        const destination = nextPath && nextPath.startsWith("/") ? nextPath : "/";
        const redirectResponse = NextResponse.redirect(new URL(destination, request.url));
        copyCookies(response, redirectResponse);
        return redirectResponse;
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
