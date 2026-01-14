import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Clock, Eye, BookOpen } from "lucide-react";

interface WorkflowDetailProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WorkflowDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const workflow = await prisma.workflow.findUnique({
        where: { slug },
        select: { title: true, description: true },
    });

    if (!workflow) return { title: "Workflow Not Found" };

    return {
        title: `${workflow.title} | Workflows`,
        description: workflow.description.slice(0, 160),
    };
}

export default async function WorkflowDetailPage({ params }: WorkflowDetailProps) {
    const { slug } = await params;

    const workflow = await prisma.workflow.findUnique({
        where: { slug },
        include: {
            platform: {
                select: {
                    name: true,
                    platformId: true,
                },
            },
        },
    });

    if (!workflow) {
        notFound();
    }

    // Increment view count
    await prisma.workflow.update({
        where: { id: workflow.id },
        data: { viewCount: { increment: 1 } },
    });

    return (
        <div className="dark min-h-screen">
            <div className="container max-w-4xl py-8">
                {/* Back Link */}
                <Link
                    href="/workflows"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Workflows
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize">
                            {workflow.category}
                        </span>
                        <Link
                            href={`/profiles/${workflow.platform.platformId}`}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            {workflow.platform.name}
                        </Link>
                        <span className="text-sm text-muted-foreground capitalize">
                            • {workflow.difficulty}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">{workflow.title}</h1>
                    <p className="mt-4 text-lg text-muted-foreground">{workflow.description}</p>

                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {workflow.viewCount} views
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-6">
                        {workflow.content}
                    </div>
                </div>

                {/* Related */}
                <div className="mt-12 pt-8 border-t">
                    <h2 className="text-xl font-bold mb-4">Explore More</h2>
                    <div className="flex gap-4">
                        <Link
                            href={`/profiles/${workflow.platform.platformId}`}
                            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent"
                        >
                            <BookOpen className="h-4 w-4" />
                            {workflow.platform.name} Guide
                        </Link>
                        <Link
                            href={`/workflows?category=${workflow.category}`}
                            className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-accent capitalize"
                        >
                            More {workflow.category} Workflows
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
