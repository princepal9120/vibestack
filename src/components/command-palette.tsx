"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import {
    Search,
    FileText,
    Folder,
    Code,
    Wand2,
    Bot,
    Server,
    Rocket,
    ExternalLink,
    CornerDownLeft,
    Loader2,
    Command,
    Layers,
    Video,
    MessageSquare,
} from "lucide-react";

interface SearchResult {
    id: string;
    type: "resource" | "project" | "platform" | "skill" | "subagent" | "mcp";
    title: string;
    description?: string;
    url: string;
    category?: string;
    platform?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    resource: FileText,
    project: Rocket,
    platform: Layers,
    skill: Wand2,
    subagent: Bot,
    mcp: Server,
};

const TYPE_COLORS: Record<string, string> = {
    resource: "text-blue-400",
    project: "text-emerald-400",
    platform: "text-purple-400",
    skill: "text-amber-400",
    subagent: "text-pink-400",
    mcp: "text-cyan-400",
};

const TYPE_LABELS: Record<string, string> = {
    resource: "Resource",
    project: "Project",
    platform: "Platform",
    skill: "Skill",
    subagent: "Sub-Agent",
    mcp: "MCP",
};

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Handle Cmd+K / Ctrl+K shortcut
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when dialog opens
    React.useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 0);
        } else {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [open]);

    // Debounced search
    React.useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            e.preventDefault();
            navigateToResult(results[selectedIndex]);
        }
    };

    const navigateToResult = (result: SearchResult) => {
        setOpen(false);
        router.push(result.url);
    };

    // Group results by type
    const groupedResults = React.useMemo(() => {
        const groups: Record<string, SearchResult[]> = {};
        results.forEach((result) => {
            if (!groups[result.type]) groups[result.type] = [];
            groups[result.type].push(result);
        });
        return groups;
    }, [results]);

    // Flatten for navigation
    const flatResults = React.useMemo(() => results, [results]);

    return (
        <>
            {/* Search Trigger Button in Navbar */}
            <button
                onClick={() => setOpen(true)}
                className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm hover:bg-muted hover:text-foreground transition-colors"
            >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <Command className="h-3 w-3" />K
                </kbd>
            </button>

            {/* Command Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 gap-0 max-w-2xl overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 border-b border-border">
                        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search resources, projects, skills, platforms..."
                            className="flex-1 h-14 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                        />
                        {isLoading && (
                            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                        )}
                        <kbd className="hidden sm:flex h-6 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {query && !isLoading && results.length === 0 && (
                            <div className="py-12 text-center text-muted-foreground">
                                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-sm">No results found for "{query}"</p>
                                <p className="text-xs mt-1">Try different keywords</p>
                            </div>
                        )}

                        {!query && (
                            <div className="py-8 px-4">
                                <p className="text-sm text-muted-foreground mb-4">Quick Actions</p>
                                <div className="grid gap-2">
                                    {[
                                        { label: "Browse Resources", href: "/resources", icon: FileText },
                                        { label: "View Projects", href: "/projects", icon: Rocket },
                                        { label: "Explore Skills", href: "/collections/skills", icon: Wand2 },
                                        { label: "Platform Guides", href: "/platforms", icon: Layers },
                                    ].map((action) => (
                                        <button
                                            key={action.href}
                                            onClick={() => {
                                                setOpen(false);
                                                router.push(action.href);
                                            }}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left transition-colors"
                                        >
                                            <action.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {Object.entries(groupedResults).map(([type, items]) => (
                            <div key={type} className="py-2">
                                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {TYPE_LABELS[type] || type}s
                                </div>
                                {items.slice(0, 5).map((result, index) => {
                                    const globalIndex = flatResults.indexOf(result);
                                    const Icon = TYPE_ICONS[result.type] || FileText;
                                    const isSelected = globalIndex === selectedIndex;

                                    return (
                                        <button
                                            key={result.id}
                                            onClick={() => navigateToResult(result)}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                                isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                                                isSelected ? "bg-primary/20" : "bg-muted"
                                            )}>
                                                <Icon className={cn("h-5 w-5", TYPE_COLORS[result.type])} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={cn(
                                                    "font-medium truncate",
                                                    isSelected ? "text-primary" : "text-foreground"
                                                )}>
                                                    {result.title}
                                                </div>
                                                {result.description && (
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {result.description}
                                                    </div>
                                                )}
                                            </div>
                                            {result.category && (
                                                <span className="flex-shrink-0 text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                                    {result.category}
                                                </span>
                                            )}
                                            {isSelected && (
                                                <CornerDownLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    {results.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↓</kbd>
                                    <span>Navigate</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↵</kbd>
                                    <span>Open</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">esc</kbd>
                                    <span>Close</span>
                                </span>
                            </div>
                            <span>{results.length} results</span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
