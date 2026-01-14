import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UpdateUserSchema } from "@/lib/validators";

interface RouteParams {
    params: Promise<{ username: string }>;
}

// GET /api/users/[username] - Get user profile
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { username } = await params;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                githubUrl: true,
                twitterUrl: true,
                createdAt: true,
                projects: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        _count: {
                            select: { upvotes: true, comments: true },
                        },
                    },
                },
                _count: {
                    select: {
                        projects: true,
                        upvotes: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: user,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[USER_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH /api/users/[username] - Update user profile
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const { username } = await params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check ownership
        if (currentUser.username !== username) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const result = UpdateUserSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        // Check username uniqueness if changing
        if (result.data.username && result.data.username !== username) {
            const existing = await prisma.user.findUnique({
                where: { username: result.data.username },
            });
            if (existing) {
                return NextResponse.json(
                    { error: "Username already taken" },
                    { status: 409 }
                );
            }
        }

        const updated = await prisma.user.update({
            where: { username },
            data: {
                ...result.data,
                githubUrl: result.data.githubUrl || null,
                twitterUrl: result.data.twitterUrl || null,
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                githubUrl: true,
                twitterUrl: true,
            },
        });

        return NextResponse.json({
            data: updated,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[USER_PATCH]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
