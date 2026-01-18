// Entity to SearchDocument Transformations
// Converts Prisma model instances to unified SearchDocument format

import type {
    Project,
    Resource,
    Skill,
    SubAgent,
    MCPServer,
    PlatformProfile,
    PromptTemplate,
    EndToEndGuide,
    User,
} from "@prisma/client";
import type { SearchDocument, EntityType, IndexableModel } from "./types";

// Helper to generate composite document ID
export function makeDocumentId(entityType: EntityType, entityId: string): string {
    return `${entityType}_${entityId}`;
}

// Helper to parse document ID
export function parseDocumentId(id: string): { entityType: EntityType; entityId: string } {
    const [entityType, ...rest] = id.split("_");
    return {
        entityType: entityType as EntityType,
        entityId: rest.join("_"),
    };
}

// Helper to convert Date to Unix timestamp (seconds)
function toTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

// Helper to merge text fields for full-text search
function mergeContent(...fields: (string | null | undefined)[]): string {
    return fields.filter(Boolean).join(" ").trim();
}

// Transform Project to SearchDocument
export function transformProject(
    project: Project & { author?: User | null }
): SearchDocument {
    return {
        id: makeDocumentId("project", project.id),
        entityType: "project",
        entityId: project.id,
        title: project.title,
        description: project.description,
        content: mergeContent(
            project.title,
            project.description,
            project.longDescription,
            project.techStack?.join(" "),
            project.category
        ),
        category: project.category,
        platforms: project.platforms || [],
        tags: project.techStack || [],
        author: project.author?.username || null,
        status: "published",
        createdAt: toTimestamp(project.createdAt),
        updatedAt: toTimestamp(project.updatedAt),
        popularity: project.upvoteCount + project.viewCount,
        url: `/projects/${project.id}`,
        thumbnail: project.screenshots?.[0] || null,
    };
}

// Transform Resource to SearchDocument
export function transformResource(resource: Resource): SearchDocument {
    return {
        id: makeDocumentId("resource", resource.id),
        entityType: "resource",
        entityId: resource.id,
        title: resource.title,
        description: resource.description || "",
        content: mergeContent(
            resource.title,
            resource.description,
            resource.type,
            resource.source,
            resource.author,
            resource.tags?.join(" ")
        ),
        category: resource.type,
        platforms: resource.platforms || [],
        tags: resource.tags || [],
        author: resource.author,
        status: resource.status,
        createdAt: toTimestamp(resource.createdAt),
        updatedAt: toTimestamp(resource.updatedAt),
        popularity: resource.viewCount + (resource.featured ? 100 : 0),
        url: `/resources?type=${resource.type}`,
        thumbnail: resource.thumbnail,
    };
}

// Transform Skill to SearchDocument
export function transformSkill(skill: Skill): SearchDocument {
    return {
        id: makeDocumentId("skill", skill.id),
        entityType: "skill",
        entityId: skill.id,
        title: skill.name,
        description: skill.tagline,
        content: mergeContent(
            skill.name,
            skill.tagline,
            skill.description,
            skill.category,
            skill.examples?.join(" "),
            skill.triggers?.join(" ")
        ),
        category: skill.category,
        platforms: skill.platforms || [],
        tags: skill.triggers || [],
        author: skill.authorName,
        status: "published",
        createdAt: toTimestamp(skill.createdAt),
        updatedAt: toTimestamp(skill.updatedAt),
        popularity: skill.useCount + (skill.featured ? 100 : 0),
        url: `/collections/skills/${skill.slug}`,
        thumbnail: skill.iconUrl,
    };
}

// Transform SubAgent to SearchDocument
export function transformSubAgent(subAgent: SubAgent): SearchDocument {
    return {
        id: makeDocumentId("subagent", subAgent.id),
        entityType: "subagent",
        entityId: subAgent.id,
        title: subAgent.name,
        description: subAgent.role,
        content: mergeContent(
            subAgent.name,
            subAgent.role,
            subAgent.category,
            subAgent.language,
            subAgent.framework,
            subAgent.whenToUse,
            subAgent.examples?.join(" ")
        ),
        category: subAgent.category,
        platforms: subAgent.platforms || [],
        tags: [subAgent.language, subAgent.framework].filter(Boolean) as string[],
        author: subAgent.authorName,
        status: "published",
        createdAt: toTimestamp(subAgent.createdAt),
        updatedAt: toTimestamp(subAgent.updatedAt),
        popularity: subAgent.useCount + (subAgent.featured ? 100 : 0),
        url: `/collections/subagents/${subAgent.slug}`,
        thumbnail: null,
    };
}

// Transform MCPServer to SearchDocument
export function transformMCPServer(mcp: MCPServer): SearchDocument {
    return {
        id: makeDocumentId("mcp", mcp.id),
        entityType: "mcp",
        entityId: mcp.id,
        title: mcp.name,
        description: mcp.description,
        content: mergeContent(
            mcp.name,
            mcp.description,
            mcp.category,
            mcp.provider
        ),
        category: mcp.category,
        platforms: mcp.platforms || [],
        tags: [mcp.provider],
        author: null,
        status: "published",
        createdAt: toTimestamp(mcp.createdAt),
        updatedAt: toTimestamp(mcp.updatedAt),
        popularity: mcp.useCount + (mcp.featured ? 100 : 0),
        url: `/collections/mcps/${mcp.slug}`,
        thumbnail: mcp.iconUrl,
    };
}

// Transform PlatformProfile to SearchDocument
export function transformPlatformProfile(platform: PlatformProfile): SearchDocument {
    return {
        id: makeDocumentId("platform", platform.id),
        entityType: "platform",
        entityId: platform.id,
        title: platform.name,
        description: platform.tagline || "",
        content: mergeContent(
            platform.name,
            platform.tagline,
            platform.description,
            platform.cheatSheet?.join(" "),
            platform.bestPractices?.join(" ")
        ),
        category: null,
        platforms: [platform.platformId],
        tags: [],
        author: null,
        status: "published",
        createdAt: toTimestamp(platform.createdAt),
        updatedAt: toTimestamp(platform.updatedAt),
        popularity: 1000, // High priority for platform pages
        url: `/platforms/${platform.platformId}`,
        thumbnail: null,
    };
}

// Transform PromptTemplate to SearchDocument
export function transformPromptTemplate(
    prompt: PromptTemplate & { platform?: PlatformProfile | null }
): SearchDocument {
    return {
        id: makeDocumentId("prompt", prompt.id),
        entityType: "prompt",
        entityId: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: mergeContent(
            prompt.title,
            prompt.description,
            prompt.category,
            prompt.useCase
        ),
        category: prompt.category,
        platforms: prompt.platform ? [prompt.platform.platformId] : [],
        tags: [prompt.category],
        author: null,
        status: "published",
        createdAt: toTimestamp(prompt.createdAt),
        updatedAt: toTimestamp(prompt.updatedAt),
        popularity: prompt.useCount,
        url: `/platforms/${prompt.platform?.platformId || "cursor"}/prompts/${prompt.slug}`,
        thumbnail: null,
    };
}

// Transform EndToEndGuide to SearchDocument
export function transformEndToEndGuide(guide: EndToEndGuide): SearchDocument {
    return {
        id: makeDocumentId("guide", guide.id),
        entityType: "guide",
        entityId: guide.id,
        title: guide.title,
        description: guide.description,
        content: mergeContent(
            guide.title,
            guide.description,
            guide.outcome,
            guide.techStack?.join(" ")
        ),
        category: null,
        platforms: guide.platforms || [],
        tags: guide.techStack || [],
        author: guide.authorName,
        status: "published",
        createdAt: toTimestamp(guide.createdAt),
        updatedAt: toTimestamp(guide.updatedAt),
        popularity: guide.viewCount + (guide.featured ? 100 : 0),
        url: `/guides/${guide.slug}`,
        thumbnail: null,
    };
}

// Generic transform function based on model name
export function transformEntity(
    model: IndexableModel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: any
): SearchDocument {
    switch (model) {
        case "Project":
            return transformProject(entity);
        case "Resource":
            return transformResource(entity);
        case "Skill":
            return transformSkill(entity);
        case "SubAgent":
            return transformSubAgent(entity);
        case "MCPServer":
            return transformMCPServer(entity);
        case "PlatformProfile":
            return transformPlatformProfile(entity);
        case "PromptTemplate":
            return transformPromptTemplate(entity);
        case "EndToEndGuide":
            return transformEndToEndGuide(entity);
        default:
            throw new Error(`Unknown model: ${model}`);
    }
}

// Get URL for a search result (used for fallback searches)
export function getEntityUrl(entityType: EntityType, entityId: string, slug?: string): string {
    switch (entityType) {
        case "project":
            return `/projects/${entityId}`;
        case "resource":
            return `/resources`;
        case "skill":
            return slug ? `/collections/skills/${slug}` : `/collections/skills`;
        case "subagent":
            return slug ? `/collections/subagents/${slug}` : `/collections/subagents`;
        case "mcp":
            return slug ? `/collections/mcps/${slug}` : `/collections/mcps`;
        case "platform":
            return slug ? `/platforms/${slug}` : `/platforms`;
        case "prompt":
            return `/prompts`;
        case "guide":
            return slug ? `/guides/${slug}` : `/guides`;
        default:
            return "/";
    }
}
