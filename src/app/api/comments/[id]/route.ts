import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UpdateCommentSchema } from "@/lib/validators";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH /api/comments/[id] - Update a comment
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
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { authorId: true },
        });

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.authorId !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const result = UpdateCommentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const updated = await prisma.comment.update({
            where: { id },
            data: { content: result.data.content },
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
        console.error("[COMMENT_PATCH]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/comments/[id] - Delete a comment
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

        // Check ownership and get projectId
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { authorId: true, projectId: true },
        });

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.authorId !== user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        // Delete comment and decrement count
        await prisma.$transaction([
            prisma.comment.delete({
                where: { id },
            }),
            prisma.project.update({
                where: { id: comment.projectId },
                data: { commentCount: { decrement: 1 } },
            }),
        ]);

        return NextResponse.json({
            data: { message: "Comment deleted" },
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[COMMENT_DELETE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
