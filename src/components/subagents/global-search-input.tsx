"use client";

import { Search } from "lucide-react";
import { useQueryState } from "nuqs";

export function GlobalSearchInput() {
    const [search, setSearch] = useQueryState("q", {
        defaultValue: "",
        shallow: true,
    });

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value || null)}
                placeholder="Search for a rule or MCP server..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
            />
        </div>
    );
}
