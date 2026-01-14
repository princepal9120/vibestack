"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-8 w-8" />
            </div>

            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Something went wrong!
                </h2>
                <p className="mt-2 text-muted-foreground max-w-md">
                    {error.message || "An unexpected error occurred while loading this page."}
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Go home
                </Link>
            </div>
        </div>
    );
}
