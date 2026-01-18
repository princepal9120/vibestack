// Autocomplete Suggestions API Endpoint
// Fuse.js fuzzy search for command palette

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { suggest } from "@/lib/search/fuse-search";
import type { SuggestResponse } from "@/lib/search/types";

// Query validation schema
const SuggestQuerySchema = z.object({
    q: z.string().min(1, "Query must be at least 1 character").max(100),
    limit: z.coerce.number().min(1).max(20).optional().default(8),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse and validate query parameters
        const params = {
            q: searchParams.get("q") || "",
            limit: searchParams.get("limit") || "8",
        };

        const validation = SuggestQuerySchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json(
                { suggestions: [], error: "Invalid query" },
                { status: 400 }
            );
        }

        const { q, limit } = validation.data;

        // Get suggestions from Fuse.js
        const suggestions = await suggest(q, limit);

        const response: SuggestResponse = { suggestions };

        return NextResponse.json(response);
    } catch (error) {
        console.error("[Suggest API] Error:", error);
        return NextResponse.json(
            { suggestions: [], error: "Suggestions failed" },
            { status: 500 }
        );
    }
}
