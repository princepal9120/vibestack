"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";

interface UpvoteButtonProps {
    projectId: string;
    initialCount: number;
    initialUpvoted?: boolean;
    className?: string;
    orientation?: "horizontal" | "vertical";
}

export function UpvoteButton({
    projectId,
    initialCount,
    initialUpvoted = false,
    className,
    orientation = "horizontal",
}: UpvoteButtonProps) {
    const router = useRouter();
    const [upvoted, setUpvoted] = useState(initialUpvoted);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const handleUpvote = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link clicks if inside a project card
        setLoading(true);

        try {
            const method = upvoted ? "DELETE" : "POST";
            const res = await fetch(`/api/projects/${projectId}/upvote`, { method });

            if (res.ok) {
                setUpvoted(!upvoted);
                setCount((prev) => (upvoted ? prev - 1 : prev + 1));
                router.refresh();
            } else if (res.status === 401) {
                // Redirect to sign in
                router.push("/sign-in");
            }
        } catch (error) {
            console.error("Upvote error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (orientation === "vertical") {
        return (
            <button
                onClick={handleUpvote}
                disabled={loading}
                className={cn(
                    "shrink-0 flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-2 min-w-[60px] transition-all hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50",
                    upvoted && "border-primary bg-primary/10 text-primary",
                    className
                )}
            >
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mb-1" />
                ) : (
                    <ArrowUp className={cn("h-5 w-5", upvoted && "fill-current")} />
                )}
                <span className="text-sm font-semibold mt-0.5">{count}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleUpvote}
            disabled={loading}
            className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                upvoted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border",
                className
            )}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ArrowUp className={cn("h-4 w-4", upvoted && "fill-current")} />
            )}
            <span>{count}</span>
        </button>
    );
}
