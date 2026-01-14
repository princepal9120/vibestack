import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CreateProjectSchema, ProjectQuerySchema } from "@/lib/validators";

// GET /api/projects - List projects with filters
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const query = ProjectQuerySchema.safeParse({
            platform: searchParams.get("platform"),
            category: searchParams.get("category"),
            search: searchParams.get("search"),
            sort: searchParams.get("sort"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        });

        if (!query.success) {
            return NextResponse.json(
                { error: "Invalid query parameters", details: query.error.flatten() },
                { status: 400 }
            );
        }

        const { platform, category, search, sort, page, limit } = query.data;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (platform) {
            where.platforms = { has: platform };
        }

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // Build orderBy
        let orderBy: Record<string, string>[] = [];
        switch (sort) {
            case "trending":
                orderBy = [{ upvoteCount: "desc" }, { createdAt: "desc" }];
                break;
            case "popular":
                orderBy = [{ viewCount: "desc" }, { createdAt: "desc" }];
                break;
            default:
                orderBy = [{ createdAt: "desc" }];
        }

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        return NextResponse.json({
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("[PROJECTS_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized", code: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const result = CreateProjectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                ...result.data,
                githubUrl: result.data.githubUrl || null,
                liveUrl: result.data.liveUrl || null,
                screenshots: result.data.screenshots || [],
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json(
            { data: project, meta: { timestamp: new Date().toISOString() } },
            { status: 201 }
        );
    } catch (error) {
        console.error("[PROJECTS_POST]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
