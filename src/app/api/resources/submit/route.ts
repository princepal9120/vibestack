import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitResourceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    url: z.string().url("Must be a valid URL"),
    description: z.string().optional().default(""),
    type: z.enum(["blog", "tutorial", "youtube", "social"]),
    authorName: z.string().optional(),
    authorHandle: z.string().optional(),
    thumbnailUrl: z.string().url().optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
});

export async function POST(request: NextRequest) {
    const requestId = crypto.randomUUID().slice(0, 8);

    try {
        const body = await request.json();
        console.log(`[Resource Submit ${requestId}] Received:`, JSON.stringify(body, null, 2));

        const result = submitResourceSchema.safeParse(body);
        if (!result.success) {
            console.log(`[Resource Submit ${requestId}] Validation failed:`, JSON.stringify(result.error.issues, null, 2));
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: result.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }

        const validated = result.data;
        console.log(`[Resource Submit ${requestId}] Validated data:`, JSON.stringify(validated, null, 2));

        // Check for duplicate URL
        const existing = await prisma.resource.findFirst({
            where: { url: validated.url },
        });

        if (existing) {
            console.log(`[Resource Submit ${requestId}] Duplicate URL found: ${existing.id}`);
            return NextResponse.json(
                {
                    success: false,
                    error: "This resource has already been submitted",
                    existingId: existing.id,
                },
                { status: 409 } // 409 Conflict is more appropriate for duplicates
            );
        }

        // Create the resource with APPROVED status (auto-approve since no admin panel yet)
        const resource = await prisma.resource.create({
            data: {
                title: validated.title,
                url: validated.url,
                description: validated.description,
                type: validated.type,
                thumbnail: validated.thumbnailUrl || null,
                author: validated.authorName || validated.authorHandle || null,
                source: validated.authorName || "Community",
                status: "APPROVED", // Auto-approve for now
            },
        });

        console.log(`[Resource Submit ${requestId}] Created resource: ${resource.id}`);

        return NextResponse.json({
            success: true,
            message: "Resource submitted for review",
            id: resource.id,
        }, { status: 201 }); // 201 Created is proper for POST that creates a resource

    } catch (error) {
        console.error(`[Resource Submit ${requestId}] Error:`, error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: error.issues
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
