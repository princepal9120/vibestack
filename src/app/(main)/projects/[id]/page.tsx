import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UpvoteButton } from "@/components/upvote-button";
import { CommentSection } from "@/components/comment-section";
import {
    Github,
    ExternalLink,
    Calendar,
    Eye,
    MessageCircle,
    ArrowLeft,
    Share2,
    ArrowUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: { author: true },
    });

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const ogImage = project.screenshots[0] || `/api/og?title=${encodeURIComponent(project.title)}&type=Project&description=${encodeURIComponent(project.description)}`;

    return {
        title: project.title,
        description: project.description,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;

    const [project, currentUser] = await Promise.all([
        prisma.project.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        bio: true,
                        githubUrl: true,
                        twitterUrl: true,
                    },
                },
                comments: {
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
                },
            },
        }),
        getCurrentUser(),
    ]);

    if (!project) {
        notFound();
    }

    // Check if current user has upvoted
    let hasUpvoted = false;
    if (currentUser) {
        const upvote = await prisma.upvote.findUnique({
            where: {
                userId_projectId: {
                    userId: currentUser.id,
                    projectId: id,
                },
            },
        });
        hasUpvoted = !!upvote;
    }

    // Increment view count
    await prisma.project.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
    });

    return (
        <div className="container py-8">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                {project.category.replace("-", " ")}
                            </span>
                            {project.platforms.map((platform) => (
                                <span
                                    key={platform}
                                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                                >
                                    {platform}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                            {project.title}
                        </h1>

                        <p className="mt-4 text-lg text-muted-foreground">
                            {project.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <UpvoteButton
                                projectId={project.id}
                                initialCount={project.upvoteCount}
                                initialUpvoted={hasUpvoted}
                            />

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    {project.commentCount} comments
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {project.viewCount} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDistanceToNow(new Date(project.createdAt), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Screenshots */}
                    {project.screenshots.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Screenshots</h2>
                            <div className="grid gap-4">
                                {project.screenshots.map((url, i) => (
                                    <div
                                        key={i}
                                        className="relative aspect-video overflow-hidden rounded-xl border bg-muted"
                                    >
                                        <Image
                                            src={url}
                                            alt={`${project.title} screenshot ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Insights */}
                    {project.keyInsights && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Key Insights</h2>
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{project.keyInsights}</p>
                            </div>
                        </div>
                    )}

                    {/* Tech Stack */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Tech Stack</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="border-t pt-8">
                        <CommentSection
                            projectId={project.id}
                            initialComments={project.comments}
                            currentUserId={currentUser?.id}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Links */}
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                        <h3 className="font-semibold">Links</h3>
                        <div className="space-y-3">
                            {project.githubUrl && (
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="mr-2 h-4 w-4" />
                                        View on GitHub
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                                    </a>
                                </Button>
                            )}
                            {project.liveUrl && (
                                <Button asChild variant="glow" className="w-full justify-start">
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Live Demo
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Author Card */}
                    <div className="rounded-xl border bg-card p-6 space-y-4">
                        <h3 className="font-semibold">Author</h3>
                        <Link
                            href={`/users/${project.author.username}`}
                            className="flex items-center gap-3 group"
                        >
                            <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                                {project.author.avatar && (
                                    <Image
                                        src={project.author.avatar}
                                        alt={project.author.username}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="font-medium group-hover:text-primary transition-colors">
                                    {project.author.username}
                                </p>
                                {project.author.bio && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {project.author.bio}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
