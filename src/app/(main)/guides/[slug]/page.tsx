import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Clock, Eye, ExternalLink, Rocket } from "lucide-react";

interface GuideDetailProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuideDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = await prisma.endToEndGuide.findUnique({
        where: { slug },
        select: { title: true, description: true },
    });

    if (!guide) return { title: "Guide Not Found" };

    return {
        title: `${guide.title} | End-to-End Guides`,
        description: guide.description.slice(0, 160),
    };
}

export default async function GuideDetailPage({ params }: GuideDetailProps) {
    const { slug } = await params;

    const guide = await prisma.endToEndGuide.findUnique({
        where: { slug },
    });

    if (!guide) {
        notFound();
    }

    // Increment view count
    await prisma.endToEndGuide.update({
        where: { id: guide.id },
        data: { viewCount: { increment: 1 } },
    });

    return (
        <div className="dark min-h-screen">
            <div className="container max-w-4xl py-8">
                {/* Back Link */}
                <Link
                    href="/guides"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Guides
                </Link>

                {/* Header */}
                <div className="mb-8">
                    {guide.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                            <Rocket className="h-4 w-4" />
                            Featured Guide
                        </span>
                    )}

                    <h1 className="text-4xl font-bold tracking-tight">{guide.title}</h1>

                    {guide.outcome && (
                        <p className="mt-4 text-xl font-medium text-primary">
                            🎯 {guide.outcome}
                        </p>
                    )}

                    <p className="mt-4 text-lg text-muted-foreground">{guide.description}</p>

                    {/* Meta */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {guide.duration && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {guide.duration}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {guide.viewCount} views
                        </span>
                        {guide.authorName && (
                            <span>
                                by{" "}
                                {guide.authorUrl ? (
                                    <a
                                        href={guide.authorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                    >
                                        {guide.authorName}
                                    </a>
                                ) : (
                                    guide.authorName
                                )}
                            </span>
                        )}
                    </div>

                    {/* Platforms & Tech Stack */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {guide.platforms.map((platform) => (
                            <Link
                                key={platform}
                                href={`/profiles/${platform}`}
                                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20"
                            >
                                {platform}
                            </Link>
                        ))}
                        {guide.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-6">
                        {guide.content}
                    </div>
                </div>

                {/* Related Project */}
                {guide.projectId && (
                    <div className="mt-12 pt-8 border-t">
                        <h2 className="text-xl font-bold mb-4">View the Project</h2>
                        <Link
                            href={`/projects/${guide.projectId}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <ExternalLink className="h-4 w-4" />
                            See the finished project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
