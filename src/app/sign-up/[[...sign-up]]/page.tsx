"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect_url");

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <SignUp forceRedirectUrl={redirectUrl || undefined} />
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        }>
            <SignUpContent />
        </Suspense>
    );
}
