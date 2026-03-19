import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/reusable/card";
import { Button } from "@/app/components/reusable/button";
import { Input } from "@/app/components/reusable/input";
import { Label } from "@/app/components/reusable/label";
import { createClient } from "@/app/utils/supabase/server";
import { LogIn, Mail } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginWithPassword, sendMagicLink } from "@/app/(auth)/login/actions";

interface LoginPageProps {
    searchParams: Promise<{
        error?: string;
        message?: string;
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

    const { error, message, next } = await searchParams;
    const nextPath = next && next.startsWith("/") ? next : "/";

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6">
                <Card className="w-full max-w-md border-slate-200/80 bg-white/85 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                    <CardHeader className="space-y-2">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                            <LogIn className="size-5" />
                        </div>
                        <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Sign in to ToyexFix
                        </CardTitle>
                        <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                            Continue to your repair dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                                {error}
                            </p>
                        ) : null}
                        {message ? (
                            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                                {message}
                            </p>
                        ) : null}

                        <form action={loginWithPassword} className="space-y-4">
                            <input type="hidden" name="next" value={nextPath} />
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                            >
                                <LogIn className="size-4" />
                                Sign in with password
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <p className="relative mx-auto w-fit bg-white px-3 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                                or
                            </p>
                        </div>

                        <form action={sendMagicLink} className="space-y-4">
                            <input type="hidden" name="next" value={nextPath} />
                            <div className="space-y-2">
                                <Label htmlFor="magic-email">Email for magic link</Label>
                                <Input
                                    id="magic-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                            <Button type="submit" variant="outline" className="w-full">
                                <Mail className="size-4" />
                                Send magic link
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}