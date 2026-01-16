import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitResourceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    url: z.string().url("Must be a valid URL"),
    description: z.string().optional(),
    type: z.enum(["blog", "tutorial", "youtube", "social"]),
    authorName: z.string().optional(),
    authorHandle: z.string().optional(),
    thumbnailUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = submitResourceSchema.parse(body);

        // Check for duplicate URL
        const existing = await prisma.resource.findFirst({
            where: { url: validated.url },
        });

        if (existing) {
            return NextResponse.json(
                { error: "This resource has already been submitted" },
                { status: 400 }
            );
        }

        // Create the resource with PENDING status
        const resource = await prisma.resource.create({
            data: {
                title: validated.title,
                url: validated.url,
                description: validated.description || "",
                type: validated.type,
                thumbnailUrl: validated.thumbnailUrl || null,
                author: validated.authorName || validated.authorHandle || null,
                source: validated.authorName || "Community",
                // Status defaults to PENDING in schema
            },
        });

        return NextResponse.json({
            success: true,
            message: "Resource submitted for review",
            id: resource.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Resource submission error:", error);
        return NextResponse.json(
            { error: "Failed to submit resource" },
            { status: 500 }
        );
    }
}
