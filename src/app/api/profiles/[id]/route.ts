import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/profiles/[id] - Get single platform profile
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const profile = await prisma.platformProfile.findFirst({
            where: {
                OR: [{ id }, { platformId: id }],
            },
        });

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: profile,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[PROFILE_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
