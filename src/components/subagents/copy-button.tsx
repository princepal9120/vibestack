"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
    content: string;
    small?: boolean;
}

export function CopyButton({ content, small }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-2 rounded-lg bg-card/80 border border-border hover:bg-accent transition-colors",
                small && "p-1.5"
            )}
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className={cn("h-4 w-4 text-green-500", small && "h-3 w-3")} />
            ) : (
                <Copy className={cn("h-4 w-4", small && "h-3 w-3")} />
            )}
        </button>
    );
}
