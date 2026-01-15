"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
    content: string;
    filename: string;
    small?: boolean;
}

export function DownloadButton({ content, filename, small }: DownloadButtonProps) {
    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className={cn(
                "p-2 rounded-lg bg-card/80 border border-border hover:bg-accent transition-colors",
                small && "p-1.5"
            )}
            title="Download as .md file"
        >
            <Download className={cn("h-4 w-4", small && "h-3 w-3")} />
        </button>
    );
}
