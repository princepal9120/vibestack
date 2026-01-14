"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThumbsUp, Loader2 } from "lucide-react";

interface UpvoteButtonProps {
    projectId: string;
    initialCount: number;
    initialUpvoted?: boolean;
    className?: string;
}

export function UpvoteButton({
    projectId,
    initialCount,
    initialUpvoted = false,
    className,
}: UpvoteButtonProps) {
    const router = useRouter();
    const [upvoted, setUpvoted] = useState(initialUpvoted);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const handleUpvote = async () => {
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

    return (
        <button
            onClick={handleUpvote}
            disabled={loading}
            className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                upvoted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border",
                className
            )}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ThumbsUp className={cn("h-4 w-4", upvoted && "fill-current")} />
            )}
            <span>{count}</span>
        </button>
    );
}
