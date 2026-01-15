"use client";

import Link from "next/link";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { Rule } from "@/lib/content/rules";
import { CopyButton } from "./copy-button";
import { ChevronDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const RuleCardSmall = memo(function RuleCardSmall({
    rule,
    isPage,
    small,
}: {
    rule: Rule;
    isPage?: boolean;
    small?: boolean;
}) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-xl flex flex-col overflow-hidden hover:border-primary/30 transition-all",
                small ? "p-3" : "p-4 aspect-square"
            )}
        >
            {/* Content Preview */}
            <div
                className={cn(
                    "bg-muted/30 rounded-lg mb-3 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group relative flex-grow overflow-hidden",
                    small ? "p-3" : "p-4",
                    isPage && "text-foreground"
                )}
            >
                {/* Copy Button */}
                <div
                    className={cn(
                        "group-hover:flex hidden absolute z-10 space-x-2",
                        small ? "right-2 bottom-2" : "right-3 bottom-3"
                    )}
                >
                    <CopyButton content={rule.content} small={small} />
                </div>

                <Link href={`/collections/subagents/${rule.slug}`}>
                    <div className="h-full overflow-y-auto">
                        <code className={cn("block pr-3", small ? "text-xs line-clamp-3" : "text-sm")}>
                            {small ? rule.description || rule.content : rule.content}
                        </code>
                    </div>
                </Link>
            </div>

            {/* Footer */}
            <div className="space-y-1">
                <h3 className={cn("font-medium truncate", small ? "text-sm" : "text-base")}>
                    {rule.title}
                </h3>

                {rule.libs && rule.libs.length > 0 && (
                    <Popover>
                        <PopoverTrigger
                            className={cn(
                                "flex gap-2 items-center overflow-x-auto whitespace-nowrap cursor-pointer hover:bg-muted/50 rounded px-1 -ml-1",
                                small ? "h-4" : "h-5"
                            )}
                        >
                            {rule.libs.slice(0, 2).map((lib) => (
                                <span
                                    key={lib}
                                    className={cn(
                                        "text-muted-foreground font-mono flex-shrink-0",
                                        small ? "text-[10px]" : "text-xs"
                                    )}
                                >
                                    {lib}
                                </span>
                            ))}
                            {rule.libs.length > 2 && (
                                <span
                                    className={cn(
                                        "text-muted-foreground font-mono flex gap-1 items-center",
                                        small ? "text-[10px]" : "text-xs"
                                    )}
                                >
                                    <span>+{rule.libs.length - 2} more</span>
                                    <ChevronDown className={small ? "w-2 h-2" : "w-3 h-3"} />
                                </span>
                            )}
                        </PopoverTrigger>
                        <PopoverContent className="p-3">
                            <div className="space-y-1">
                                {rule.libs.map((lib) => (
                                    <div key={lib} className="text-xs text-muted-foreground font-mono">
                                        {lib}
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div>
    );
});
