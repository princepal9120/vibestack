"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
    text: string;
    label?: string;
    className?: string;
}

export function CopyButton({ text, label = "Copied!", className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(label, {
                description: "Copied to clipboard",
                duration: 2000,
            });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy", {
                description: "Please try again",
            });
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-2 rounded-lg bg-card border border-border transition-all hover:bg-accent shadow-sm",
                className
            )}
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}
