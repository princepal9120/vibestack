// Fuse.js Search Implementation
// Free, in-memory fuzzy search replacing Meilisearch

import Fuse, { IFuseOptions, FuseResult } from "fuse.js";
import { prisma } from "@/lib/prisma";
import type {
    SearchDocument,
    SearchResult,
    SearchFacets,
    SearchQuery,
    SearchSuggestion,
} from "./types";
import {
    transformProject,
    transformResource,
    transformSkill,
    transformSubAgent,
    transformMCPServer,
    transformPlatformProfile,
    transformPromptTemplate,
    transformEndToEndGuide,
} from "./transform";

// In-memory cache for search index
let searchIndex: Fuse<SearchDocument> | null = null;
let searchDocuments: SearchDocument[] = [];
let lastIndexBuild = 0;
const INDEX_TTL = 5 * 60 * 1000; // 5 minutes cache

// Fuse.js configuration for optimal fuzzy search
const FUSE_OPTIONS: IFuseOptions<SearchDocument> = {
    keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.25 },
        { name: "content", weight: 0.2 },
        { name: "tags", weight: 0.1 },
        { name: "author", weight: 0.05 },
    ],
    threshold: 0.4, // Lower = more strict matching
    distance: 100,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    useExtendedSearch: true,
};

// Build search index from database
async function buildSearchIndex(): Promise<void> {
    const now = Date.now();

    // Return cached index if still valid
    if (searchIndex && now - lastIndexBuild < INDEX_TTL) {
        return;
    }

    console.log("[Fuse Search] Building search index...");
    const startTime = Date.now();

    const documents: SearchDocument[] = [];

    // Fetch all searchable entities in parallel
    const [
        projects,
        resources,
        skills,
        subAgents,
        mcpServers,
        platforms,
        prompts,
        guides,
    ] = await Promise.all([
        prisma.project.findMany({
            include: { author: true },
        }),
        prisma.resource.findMany({
            where: { status: "APPROVED" },
        }),
        prisma.skill.findMany(),
        prisma.subAgent.findMany(),
        prisma.mCPServer.findMany(),
        prisma.platformProfile.findMany(),
        prisma.promptTemplate.findMany({
            include: { platform: true },
        }),
        prisma.endToEndGuide.findMany(),
    ]);

    // Transform all entities to search documents
    projects.forEach((p) => documents.push(transformProject(p)));
    resources.forEach((r) => documents.push(transformResource(r)));
    skills.forEach((s) => documents.push(transformSkill(s)));
    subAgents.forEach((s) => documents.push(transformSubAgent(s)));
    mcpServers.forEach((m) => documents.push(transformMCPServer(m)));
    platforms.forEach((p) => documents.push(transformPlatformProfile(p)));
    prompts.forEach((p) => documents.push(transformPromptTemplate(p)));
    guides.forEach((g) => documents.push(transformEndToEndGuide(g)));

    // Build Fuse index
    searchIndex = new Fuse(documents, FUSE_OPTIONS);
    searchDocuments = documents;
    lastIndexBuild = now;

    console.log(
        `[Fuse Search] Index built with ${documents.length} documents in ${Date.now() - startTime}ms`
    );
}

// Force rebuild index (call after CRUD operations)
export function invalidateSearchIndex(): void {
    searchIndex = null;
    searchDocuments = [];
    lastIndexBuild = 0;
}

// Main search function
export async function search(query: SearchQuery): Promise<{
    results: SearchResult[];
    facets: SearchFacets;
    total: number;
    latency: number;
}> {
    const startTime = Date.now();

    // Build/refresh index if needed
    await buildSearchIndex();

    if (!searchIndex || !query.q.trim()) {
        return {
            results: [],
            facets: { entityType: {}, platform: {}, category: {} },
            total: 0,
            latency: Date.now() - startTime,
        };
    }

    // Execute Fuse.js search
    const fuseResults = searchIndex.search(query.q);

    // Apply filters
    let filteredResults = fuseResults.map((r) => r.item);

    if (query.type) {
        filteredResults = filteredResults.filter((d) => d.entityType === query.type);
    }
    if (query.platform) {
        filteredResults = filteredResults.filter((d) =>
            d.platforms.includes(query.platform!)
        );
    }
    if (query.category) {
        filteredResults = filteredResults.filter((d) => d.category === query.category);
    }

    // Apply sorting
    if (query.sort === "recent") {
        filteredResults.sort((a, b) => b.createdAt - a.createdAt);
    } else if (query.sort === "popular") {
        filteredResults.sort((a, b) => b.popularity - a.popularity);
    }
    // 'relevance' is default (Fuse.js order)

    // Pagination
    const limit = Math.min(query.limit || 20, 50);
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    const paginatedResults = filteredResults.slice(offset, offset + limit);

    // Build facets from ALL filtered results (before pagination)
    const facets = buildFacets(filteredResults);

    // Transform to SearchResult format
    const results: SearchResult[] = paginatedResults.map((doc, idx) => {
        const fuseMatch = fuseResults.find((r) => r.item.id === doc.id);
        return {
            id: doc.id,
            entityType: doc.entityType,
            entityId: doc.entityId,
            title: doc.title,
            description: doc.description,
            url: doc.url,
            category: doc.category,
            platforms: doc.platforms,
            thumbnail: doc.thumbnail,
            _score: fuseMatch?.score ? 1 - fuseMatch.score : 1,
            _highlights: buildHighlights(doc, query.q, fuseMatch),
        };
    });

    return {
        results,
        facets,
        total: filteredResults.length,
        latency: Date.now() - startTime,
    };
}

// Autocomplete suggestions
export async function suggest(
    query: string,
    limit: number = 8
): Promise<SearchSuggestion[]> {
    if (!query.trim()) return [];

    await buildSearchIndex();

    if (!searchIndex) return [];

    const fuseResults = searchIndex.search(query, { limit });

    return fuseResults.map((result) => ({
        text: result.item.title,
        type: "entity" as const,
        entityType: result.item.entityType,
        entityId: result.item.entityId,
        url: result.item.url,
    }));
}

// Build facet counts
function buildFacets(documents: SearchDocument[]): SearchFacets {
    const entityType: Record<string, number> = {};
    const platform: Record<string, number> = {};
    const category: Record<string, number> = {};

    for (const doc of documents) {
        // Entity type facet
        entityType[doc.entityType] = (entityType[doc.entityType] || 0) + 1;

        // Platform facets
        for (const p of doc.platforms) {
            platform[p] = (platform[p] || 0) + 1;
        }

        // Category facet
        if (doc.category) {
            category[doc.category] = (category[doc.category] || 0) + 1;
        }
    }

    return { entityType, platform, category };
}

// Build highlight markup for matched text
function buildHighlights(
    doc: SearchDocument,
    query: string,
    fuseMatch?: FuseResult<SearchDocument>
): SearchResult["_highlights"] {
    const highlights: SearchResult["_highlights"] = {};

    // Simple highlighting: wrap matched terms in <mark> tags
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const highlightText = (text: string): string => {
        let result = text;
        for (const term of terms) {
            const regex = new RegExp(`(${escapeRegex(term)})`, "gi");
            result = result.replace(regex, "<mark>$1</mark>");
        }
        return result;
    };

    // Only highlight if we have matches
    if (fuseMatch?.matches?.length) {
        highlights.title = highlightText(doc.title);
        highlights.description = highlightText(doc.description);
    }

    return highlights;
}

// Escape special regex characters
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Health check
export async function healthCheck(): Promise<boolean> {
    try {
        await buildSearchIndex();
        return searchIndex !== null;
    } catch {
        return false;
    }
}

// Get stats
export function getStats(): { numberOfDocuments: number; isIndexing: boolean } {
    return {
        numberOfDocuments: searchDocuments.length,
        isIndexing: false,
    };
}
