"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    slug: string;
    small?: boolean;
}

export function ShareButton({ slug, small }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}/collections/subagents/${slug}`;

        if (navigator.share) {
            try {
                await navigator.share({ url });
                return;
            } catch {
                // Fall through to clipboard
            }
        }

        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "p-2 rounded-lg bg-card/80 border border-border hover:bg-accent transition-colors",
                small && "p-1.5"
            )}
            title="Share"
        >
            {copied ? (
                <Check className={cn("h-4 w-4 text-green-500", small && "h-3 w-3")} />
            ) : (
                <Share2 className={cn("h-4 w-4", small && "h-3 w-3")} />
            )}
        </button>
    );
}
