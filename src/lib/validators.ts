import { z } from "zod";

// =============================================================================
// Project Schemas
// =============================================================================

export const CreateProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters").max(500),
    longDescription: z.string().optional(),
    platforms: z.array(z.string()).min(1, "Select at least one platform"),
    techStack: z.array(z.string()).min(1, "Select at least one technology"),
    category: z.enum([
        "web-app",
        "cli",
        "mobile",
        "data",
        "ml",
        "library",
        "automation",
        "game",
        "other",
    ]),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
    screenshots: z.array(z.string().url()).optional(),
    keyInsights: z.string().optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// =============================================================================
// Comment Schemas
// =============================================================================

export const CreateCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
});

export const UpdateCommentSchema = CreateCommentSchema;

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;

// =============================================================================
// User Profile Schemas
// =============================================================================

export const UpdateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    bio: z.string().max(500).optional(),
    githubUrl: z.string().url().optional().or(z.literal("")),
    twitterUrl: z.string().url().optional().or(z.literal("")),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// =============================================================================
// Query Schemas
// =============================================================================

export const ProjectQuerySchema = z.object({
    platform: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(["newest", "trending", "popular"]).optional().default("newest"),
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export type ProjectQueryInput = z.infer<typeof ProjectQuerySchema>;
