import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";

interface SearchItem {
    id: string;
    type: "resource" | "project" | "platform" | "skill" | "subagent" | "mcp";
    title: string;
    description?: string;
    url: string;
    category?: string;
    platform?: string;
}

// Configure Fuse.js options for fuzzy search
const fuseOptions = {
    includeScore: true,
    threshold: 0.4, // Lower = more strict matching
    keys: ["title", "description", "category"],
    minMatchCharLength: 2,
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q")?.trim() || "";

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        // Fetch all searchable items from database in parallel
        const [resources, projects, platforms, skills, subAgents, mcps] = await Promise.all([
            prisma.resource.findMany({
                where: { status: "APPROVED" },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    platform: true,
                },
                take: 100,
            }),
            prisma.project.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    techStack: true,
                },
                take: 50,
            }),
            prisma.platformProfile.findMany({
                select: {
                    id: true,
                    platformId: true,
                    name: true,
                    tagline: true,
                },
            }),
            prisma.skill.findMany({
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    tagline: true,
                    category: true,
                },
            }),
            prisma.subAgent.findMany({
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    role: true,
                    category: true,
                },
            }),
            prisma.mCPServer.findMany({
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    description: true,
                    category: true,
                },
            }),
        ]);

        // Transform to unified search format
        const searchItems: SearchItem[] = [
            ...resources.map((r) => ({
                id: r.id,
                type: "resource" as const,
                title: r.title,
                description: r.description || undefined,
                url: `/resources?type=${r.type}`,
                category: r.type,
                platform: r.platform || undefined,
            })),
            ...projects.map((p) => ({
                id: p.id,
                type: "project" as const,
                title: p.title,
                description: p.description || undefined,
                url: `/projects/${p.id}`,
                category: p.techStack?.[0] || undefined,
            })),
            ...platforms.map((p) => ({
                id: p.id,
                type: "platform" as const,
                title: p.name,
                description: p.tagline || undefined,
                url: `/platforms/${p.platformId}`,
            })),
            ...skills.map((s) => ({
                id: s.id,
                type: "skill" as const,
                title: s.name,
                description: s.tagline || undefined,
                url: `/collections/skills?category=${s.category}`,
                category: s.category,
            })),
            ...subAgents.map((s) => ({
                id: s.id,
                type: "subagent" as const,
                title: s.name,
                description: s.role || undefined,
                url: `/collections/subagents?category=${s.category}`,
                category: s.category,
            })),
            ...mcps.map((m) => ({
                id: m.id,
                type: "mcp" as const,
                title: m.name,
                description: m.description || undefined,
                url: `/collections/mcps`,
                category: m.category || undefined,
            })),
        ];

        // Perform fuzzy search
        const fuse = new Fuse(searchItems, fuseOptions);
        const searchResults = fuse.search(query);

        // Return top results sorted by relevance
        const results = searchResults
            .slice(0, 20)
            .map((result) => result.item);

        return NextResponse.json({
            results,
            query,
            total: results.length,
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Search failed", results: [] },
            { status: 500 }
        );
    }
}
