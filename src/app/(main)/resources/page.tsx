import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
    ExternalLink,
    BookOpen,
    FileText,
    Youtube,
    MessageCircle,
    Newspaper,
    Play,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Resources | Vibe Stack",
    description: "Curated blogs, articles, X posts, and YouTube videos for AI coding",
};

const TYPE_CONFIG = {
    blog: { icon: BookOpen, label: "Blog", color: "bg-blue-500 text-white", gradient: "from-blue-500/20 to-blue-600/10" },
    article: { icon: Newspaper, label: "Article", color: "bg-emerald-500 text-white", gradient: "from-emerald-500/20 to-emerald-600/10" },
    x_post: { icon: MessageCircle, label: "X Post", color: "bg-sky-500 text-white", gradient: "from-sky-500/20 to-sky-600/10" },
    youtube: { icon: Youtube, label: "YouTube", color: "bg-red-500 text-white", gradient: "from-red-500/20 to-red-600/10" },
    tutorial: { icon: FileText, label: "Tutorial", color: "bg-purple-500 text-white", gradient: "from-purple-500/20 to-purple-600/10" },
};

interface ResourcesPageProps {
    searchParams: Promise<{
        type?: string;
        platform?: string;
    }>;
}

async function ResourcesList({ searchParams }: { searchParams: ResourcesPageProps["searchParams"] }) {
    const params = await searchParams;
    const { type, platform } = params;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (platform) where.platforms = { has: platform };

    const resources = await prisma.resource.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 50,
    });

    if (resources.length === 0) {
        return (
            <div className="text-center py-16">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No resources found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for curated AI coding content
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
                const config = TYPE_CONFIG[resource.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.article;
                const Icon = config.icon;
                const isYoutube = resource.type === "youtube";

                return (
                    <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    >
                        {/* Thumbnail / Gradient Background */}
                        <div className={cn(
                            "relative aspect-video overflow-hidden",
                            !resource.thumbnail && `bg-gradient-to-br ${config.gradient}`
                        )}>
                            {resource.thumbnail ? (
                                <Image
                                    src={resource.thumbnail}
                                    alt={resource.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon className="h-16 w-16 text-muted-foreground/30" />
                                </div>
                            )}

                            {/* Play button overlay for YouTube */}
                            {isYoutube && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="rounded-full bg-red-500 p-4 shadow-lg">
                                        <Play className="h-6 w-6 text-white fill-white" />
                                    </div>
                                </div>
                            )}

                            {/* Featured Badge - ClaudeBuzz style */}
                            {resource.featured && (
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                                        ★ FEATURED
                                    </span>
                                </div>
                            )}

                            {/* Type Badge - top right */}
                            <div className="absolute top-3 right-3">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold shadow-lg",
                                    config.color
                                )}>
                                    <Icon className="h-3 w-3" />
                                    {config.label}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                            {/* Title */}
                            <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {resource.title}
                            </h3>

                            {/* Description */}
                            {resource.description && (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {resource.description}
                                </p>
                            )}

                            {/* Author - ClaudeBuzz style with initial avatar */}
                            <div className="mt-auto pt-4 flex items-center gap-2">
                                {resource.author && (
                                    <>
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                            {resource.author.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {resource.author}
                                        </span>
                                    </>
                                )}
                                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

function TypeFilter({ currentType }: { currentType?: string }) {
    const types = [
        { value: "", label: "All", icon: null },
        { value: "youtube", label: "YouTube", icon: Youtube },
        { value: "blog", label: "Blogs", icon: BookOpen },
        { value: "article", label: "Articles", icon: Newspaper },
        { value: "x_post", label: "X Posts", icon: MessageCircle },
        { value: "tutorial", label: "Tutorials", icon: FileText },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {types.map((type) => {
                const isActive = currentType === type.value || (!currentType && !type.value);
                return (
                    <a
                        key={type.value}
                        href={type.value ? `/resources?type=${type.value}` : "/resources"}
                        className={cn(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        {type.icon && <type.icon className="h-4 w-4" />}
                        {type.label}
                    </a>
                );
            })}
        </div>
    );
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
    const params = await searchParams;

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <BookOpen className="h-4 w-4" />
                        Resources
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Videos & tutorials from the community
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Curated blogs, articles, X posts, and YouTube videos for AI coding
                    </p>
                </div>

                {/* Filters */}
                <TypeFilter currentType={params.type} />

                {/* Resources Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="aspect-video bg-muted" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <ResourcesList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
