import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST /api/projects/[id]/upvote - Upvote a project
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

        // Check if already upvoted
        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId,
                },
            },
        });

        if (existingUpvote) {
            return NextResponse.json(
                { error: "Already upvoted" },
                { status: 409 }
            );
        }

        // Create upvote and increment count
        await prisma.$transaction([
            prisma.upvote.create({
                data: {
                    userId: user.id,
                    projectId,
                },
            }),
            prisma.project.update({
                where: { id: projectId },
                data: { upvoteCount: { increment: 1 } },
            }),
        ]);

        return NextResponse.json(
            { data: { message: "Upvoted" }, meta: { timestamp: new Date().toISOString() } },
            { status: 201 }
        );
    } catch (error) {
        console.error("[UPVOTE_POST]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id]/upvote - Remove upvote
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const { id: projectId } = await params;
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if upvote exists
        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId,
                },
            },
        });

        if (!existingUpvote) {
            return NextResponse.json(
                { error: "Upvote not found" },
                { status: 404 }
            );
        }

        // Delete upvote and decrement count
        await prisma.$transaction([
            prisma.upvote.delete({
                where: {
                    userId_projectId: {
                        userId: user.id,
                        projectId,
                    },
                },
            }),
            prisma.project.update({
                where: { id: projectId },
                data: { upvoteCount: { decrement: 1 } },
            }),
        ]);

        return NextResponse.json({
            data: { message: "Upvote removed" },
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[UPVOTE_DELETE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
