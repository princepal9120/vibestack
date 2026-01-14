import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/profiles - List all platform profiles
export async function GET() {
    try {
        const profiles = await prisma.platformProfile.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            data: profiles,
            meta: { timestamp: new Date().toISOString() },
        });
    } catch (error) {
        console.error("[PROFILES_GET]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
