import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CreateCommentSchema } from "@/lib/validators";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id]/comments - Get comments for a project
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { id: projectId } = await params;

        const comments = await prisma.comment.findMany({
            where: { projectId },
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
        });

        return NextResponse.json({
            data: comments,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[COMMENTS_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/projects/[id]/comments - Create a comment
export async function POST(req: Request, { params }: RouteParams) {
    try {
        const { id: projectId } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const result = CreateCommentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Create comment and increment count
        const [comment] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    content: result.data.content,
                    projectId,
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
            }),
            prisma.project.update({
                where: { id: projectId },
                data: { commentCount: { increment: 1 } },
            }),
        ]);

        return NextResponse.json(
            { data: comment, meta: { timestamp: new Date().toISOString() } },
            { status: 201 }
        );
    } catch (error) {
        console.error("[COMMENTS_POST]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
