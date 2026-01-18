// Search System Types
// Unified types for Meilisearch, pgvector, and search API

export const ENTITY_TYPES = [
    "project",
    "resource",
    "skill",
    "subagent",
    "mcp",
    "platform",
    "prompt",
    "guide",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const INDEXABLE_MODELS = [
    "Project",
    "Resource",
    "Skill",
    "SubAgent",
    "MCPServer",
    "PlatformProfile",
    "PromptTemplate",
    "EndToEndGuide",
] as const;

export type IndexableModel = (typeof INDEXABLE_MODELS)[number];

// Mapping from Prisma model names to EntityType
export const MODEL_TO_ENTITY_TYPE: Record<IndexableModel, EntityType> = {
    Project: "project",
    Resource: "resource",
    Skill: "skill",
    SubAgent: "subagent",
    MCPServer: "mcp",
    PlatformProfile: "platform",
    PromptTemplate: "prompt",
    EndToEndGuide: "guide",
};

// Unified search document schema for Meilisearch
export interface SearchDocument {
    id: string; // Composite: "entityType_entityId" e.g., "project_abc123"
    entityType: EntityType;
    entityId: string;
    title: string;
    description: string;
    content: string; // Merged searchable text (title + description + other fields)
    category: string | null;
    platforms: string[];
    tags: string[];
    author: string | null;
    status: string;
    createdAt: number; // Unix timestamp in seconds
    updatedAt: number; // Unix timestamp in seconds
    popularity: number; // Computed score for ranking
    url: string;
    thumbnail: string | null;
    // Vector embedding for semantic search (Meilisearch hybrid search)
    _vectors?: {
        default: number[];
    };
}

// Search result with highlights from Meilisearch
export interface SearchResult {
    id: string;
    entityType: EntityType;
    entityId: string;
    title: string;
    description: string;
    url: string;
    category: string | null;
    platforms: string[];
    thumbnail: string | null;
    _score: number;
    _highlights: {
        title?: string;
        description?: string;
        content?: string;
    };
}

// Facet counts for filtering
export interface SearchFacets {
    entityType: Record<string, number>;
    platform: Record<string, number>;
    category: Record<string, number>;
}

// Search API response
export interface SearchResponse {
    results: SearchResult[];
    facets: SearchFacets;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        latency: number;
        cached: boolean;
    };
}

// Search query parameters
export interface SearchQuery {
    q: string;
    type?: EntityType;
    platform?: string;
    category?: string;
    sort?: "relevance" | "recent" | "popular";
    page?: number;
    limit?: number;
}

// Autocomplete suggestion
export interface SearchSuggestion {
    text: string;
    type: "entity" | "query";
    entityType?: EntityType;
    entityId?: string;
    url?: string;
}

// Suggest API response
export interface SuggestResponse {
    suggestions: SearchSuggestion[];
}

// Index job payload (for QStash)
export interface IndexJobPayload {
    action: "index" | "delete";
    model: IndexableModel;
    entityId: string;
    timestamp: number;
}

// Reindex job result
export interface ReindexResult {
    total: number;
    indexed: number;
    errors: number;
    duration: number;
}

// Circuit breaker state
export interface CircuitBreakerState {
    failures: number;
    lastFailure: number | null;
    isOpen: boolean;
}

// Cache key types
export type CacheKeyType = "search" | "suggest" | "facets";

// Search service status
export interface SearchServiceStatus {
    meilisearch: "healthy" | "degraded" | "down";
    redis: "healthy" | "degraded" | "down";
    lastCheck: number;
}
