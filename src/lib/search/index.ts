// Search Library Exports
// Fuse.js based search system

// Types
export * from "./types";

// Fuse.js search functions
export {
    search,
    suggest,
    invalidateSearchIndex,
    healthCheck,
    getStats,
} from "./fuse-search";

// Entity transformations (keep for data transformation)
export {
    makeDocumentId,
    parseDocumentId,
    transformProject,
    transformResource,
    transformSkill,
    transformSubAgent,
    transformMCPServer,
    transformPlatformProfile,
    transformPromptTemplate,
    transformEndToEndGuide,
    transformEntity,
    getEntityUrl,
} from "./transform";
