import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UpdateProjectSchema } from "@/lib/validators";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Get single project
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true,
                        githubUrl: true,
                        twitterUrl: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                _count: {
                    select: {
                        upvotes: true,
                        comments: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // Increment view count (fire and forget)
        prisma.project
            .update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            })
            .catch(console.error);

        return NextResponse.json({
            data: project,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[PROJECT_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const project = await prisma.project.findUnique({
            where: { id },
            select: { authorId: true },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        if (project.authorId !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const result = UpdateProjectSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const updated = await prisma.project.update({
            where: { id },
            data: {
                ...result.data,
                githubUrl: result.data.githubUrl || null,
                liveUrl: result.data.liveUrl || null,
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

        return NextResponse.json({
            data: updated,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[PROJECT_PATCH]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        const project = await prisma.project.findUnique({
            where: { id },
            select: { authorId: true },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        if (project.authorId !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({
            data: { message: "Project deleted" },
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[PROJECT_DELETE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
