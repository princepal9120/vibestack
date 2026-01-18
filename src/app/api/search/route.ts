// Search API Endpoint
// Fuse.js fuzzy search with facets and highlighting

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { search } from "@/lib/search/fuse-search";
import {
    ENTITY_TYPES,
    type SearchResponse,
    type SearchQuery,
} from "@/lib/search/types";

// Query validation schema
const SearchQuerySchema = z.object({
    q: z.string().min(2, "Query must be at least 2 characters").max(200),
    type: z.enum(ENTITY_TYPES as readonly [string, ...string[]]).optional(),
    platform: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(["relevance", "recent", "popular"]).optional().default("relevance"),
    page: z.coerce.number().min(1).max(100).optional().default(1),
    limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export async function GET(request: NextRequest) {
    const startTime = Date.now();

    try {
        const searchParams = request.nextUrl.searchParams;

        // Parse and validate query parameters
        const params = {
            q: searchParams.get("q") || "",
            type: searchParams.get("type") || undefined,
            platform: searchParams.get("platform") || undefined,
            category: searchParams.get("category") || undefined,
            sort: searchParams.get("sort") || "relevance",
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "20",
        };

        const validation = SearchQuerySchema.safeParse(params);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid query parameters",
                    details: validation.error.flatten().fieldErrors,
                    results: [],
                },
                { status: 400 }
            );
        }

        const query: SearchQuery = validation.data as SearchQuery;

        // Execute Fuse.js search
        const searchResult = await search(query);

        const response: SearchResponse = {
            results: searchResult.results,
            facets: searchResult.facets,
            meta: {
                total: searchResult.total,
                page: query.page || 1,
                limit: query.limit || 20,
                totalPages: Math.ceil(searchResult.total / (query.limit || 20)),
                latency: searchResult.latency,
                cached: false,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("[Search API] Error:", error);

        return NextResponse.json(
            {
                error: "Search failed",
                results: [],
                facets: { entityType: {}, platform: {}, category: {} },
                meta: {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0,
                    latency: Date.now() - startTime,
                    cached: false,
                },
            },
            { status: 500 }
        );
    }
}
