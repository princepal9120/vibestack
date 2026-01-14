"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useCallback, useTransition } from "react";

const PLATFORMS = [
    { value: "", label: "All Platforms" },
    { value: "cursor", label: "Cursor" },
    { value: "claude-code", label: "Claude Code" },
    { value: "ramp", label: "Ramp" },
    { value: "ralph", label: "Ralph" },
    { value: "replit-ai", label: "Replit AI" },
];

const CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "web-app", label: "Web App" },
    { value: "cli", label: "CLI" },
    { value: "mobile", label: "Mobile" },
    { value: "data", label: "Data" },
    { value: "ml", label: "ML/AI" },
    { value: "library", label: "Library" },
    { value: "automation", label: "Automation" },
    { value: "game", label: "Game" },
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "trending", label: "Trending" },
    { value: "popular", label: "Most Popular" },
];

export function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");

    const updateParams = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page"); // Reset pagination

            startTransition(() => {
                router.push(`/projects?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams("search", search);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={searchParams.get("platform") || ""}
                    onChange={(e) => updateParams("platform", e.target.value)}
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>

                <select
                    value={searchParams.get("category") || ""}
                    onChange={(e) => updateParams("category", e.target.value)}
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>

                <select
                    value={searchParams.get("sort") || "newest"}
                    onChange={(e) => updateParams("sort", e.target.value)}
                    className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>

                {isPending && (
                    <span className="text-sm text-muted-foreground animate-pulse">
                        Loading...
                    </span>
                )}
            </div>
        </div>
    );
}
