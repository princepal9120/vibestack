import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { PlusIcon, SparklesIcon, Tag } from "lucide-react";

import {
    ResourcesIcon,
    YouTubeIcon,
    XIcon
} from "@/components/icons";
import { ResourceBentoCard } from "@/components/resource-bento-card";
import { TweetCard } from "@/components/tweet-card";
import { ResourceCard } from "@/components/resource-card";

export const metadata: Metadata = {
    title: "Resources | Vibe Stack",
    description: "Videos, tutorials, and blog posts about AI coding tools",
};

const CATEGORIES = [
    { value: "", label: "All Resources", icon: ResourcesIcon },
    { value: "youtube", label: "YouTube Videos", icon: YouTubeIcon },
    { value: "blog", label: "Blog Posts", icon: ResourcesIcon },
    { value: "social", label: "Social Posts", icon: XIcon },
];

const PLATFORMS = [
    { id: "claude-code", label: "Claude Code" },
    { id: "cursor", label: "Cursor" },
    { id: "windsurf", label: "Windsurf" },
    { id: "copilot", label: "GitHub Copilot" },
    { id: "replit", label: "Replit AI" },
    { id: "gemini", label: "Gemini CLI" },
];

interface ResourcesPageProps {
    searchParams: Promise<{
        type?: string;
        platform?: string;
    }>;
}

async function CategorySidebar({ currentType, currentPlatform }: { currentType?: string; currentPlatform?: string }) {
    const counts = await prisma.resource.groupBy({
        by: ["type"],
        _count: { id: true },
        where: { status: "APPROVED" },
    });

    const total = counts.reduce((acc, c) => acc + c._count.id, 0);

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
                {/* Type Categories */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                        Collections
                    </h3>
                    <nav className="space-y-1">
                        {CATEGORIES.map((cat) => {
                            let count = 0;

                            if (!cat.value) {
                                count = total;
                            } else if (cat.value === "blog") {
                                count = counts
                                    .filter(c => c.type === "blog" || c.type === "article")
                                    .reduce((acc, c) => acc + c._count.id, 0);
                            } else {
                                count = counts.find(c => c.type === cat.value)?._count.id || 0;
                            }

                            const isActive = currentType === cat.value || (!currentType && !cat.value);

                            // Preserve platform filter when changing type
                            const query = new URLSearchParams();
                            if (cat.value) query.set("type", cat.value);
                            if (currentPlatform) query.set("platform", currentPlatform);
                            const href = query.toString() ? `/resources?${query.toString()}` : "/resources";

                            return (
                                <Link
                                    key={cat.value}
                                    href={href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <cat.icon className={cn(
                                            "h-4 w-4 transition-colors",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        <span>{cat.label}</span>
                                    </div>
                                    <span className={cn(
                                        "text-xs tabular-nums px-2 py-0.5 rounded-full transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                                    )}>{count}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Platform Filters */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                        Filter by Platform
                    </h3>
                    <nav className="space-y-1">
                        {PLATFORMS.map((platform) => {
                            const isActive = currentPlatform === platform.id;

                            // Preserve type filter when changing platform
                            const query = new URLSearchParams();
                            if (currentType) query.set("type", currentType);
                            // Toggle: clicking active platform clears it
                            if (!isActive) query.set("platform", platform.id);

                            const href = query.toString() ? `/resources?${query.toString()}` : "/resources";

                            return (
                                <Link
                                    key={platform.id}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all duration-200 group",
                                        isActive
                                            ? "bg-muted/80 text-foreground font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <Tag className={cn(
                                        "h-3.5 w-3.5 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground/70"
                                    )} />
                                    <span>{platform.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}

async function ResourcesList({ searchParams }: { searchParams: ResourcesPageProps["searchParams"] }) {
    const params = await searchParams;
    const { type, platform } = params;

    // Build query
    const where: any = { status: "APPROVED" };

    if (type === "blog") {
        where.type = { in: ["blog", "article"] };
    } else if (type) {
        where.type = type;
    }

    // Platform filter: search in platforms array OR in title/description
    if (platform) {
        const keyword = platform.replace(/-/g, " ");
        where.OR = [
            { platforms: { has: platform } },
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
        ];
    }

    const resources = await prisma.resource.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 100,
    });

    if (resources.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border/50">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <ResourcesIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    {platform
                        ? `No resources found for "${platform.replace(/-/g, " ")}". Try clearing the filter.`
                        : "Be the first to share something with the community."}
                </p>
                <Link
                    href="/submit/resource"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <PlusIcon className="h-4 w-4" />
                    Submit Resource
                </Link>
            </div>
        );
    }

    // If any filter is active, show grid view
    if (type || platform) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
                    <span>Showing {resources.length} results</span>
                    {platform && (
                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md text-foreground text-xs">
                            <Tag className="h-3 w-3" /> {platform.replace(/-/g, " ")}
                        </span>
                    )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => {
                        if (resource.type === "social") {
                            return (
                                <TweetCard
                                    key={resource.id}
                                    author={{
                                        name: resource.author || "Unknown",
                                        handle: resource.source || (resource.author ? `@${resource.author.replace(/\s+/g, '').toLowerCase()}` : "@unknown"),
                                        avatar: resource.thumbnail || "https://github.com/shadcn.png",
                                    }}
                                    content={resource.description || resource.title}
                                    href={resource.url}
                                />
                            );
                        }
                        return <ResourceCard key={resource.id} resource={resource} />;
                    })}
                </div>
            </div>
        );
    }

    // Bento Grid View (Library Dashboard - no filters)
    const videos = resources.filter(r => r.type === "youtube");
    const tweets = resources.filter(r => r.type === "social");
    const blogs = resources.filter(r => r.type === "blog" || r.type === "article");
    const official = resources.filter(r => {
        const author = r.author?.toLowerCase() || "";
        return author.includes("anthropic") || author.includes("google") || author.includes("openai") || r.tags.includes("official");
    });

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[500px]">
            {/* X Posts / Community Vibe */}
            <ResourceBentoCard
                title="X Posts"
                subtitle="Threads, insights & hot takes"
                icon={XIcon}
                resources={tweets}
                type="social"
                href="/resources?type=social"
                className="lg:col-span-1"
            />

            {/* Videos */}
            <ResourceBentoCard
                title="Videos"
                subtitle="Tutorials, demos & deep dives"
                icon={YouTubeIcon}
                resources={videos}
                type="youtube"
                href="/resources?type=youtube"
                className="lg:col-span-1"
            />

            {/* Blogs */}
            <ResourceBentoCard
                title="Blog Posts"
                subtitle="Articles, guides & analysis"
                icon={ResourcesIcon}
                resources={blogs}
                type="blog"
                href="/resources?type=blog"
                className="lg:col-span-1"
            />

            {/* Official / Featured Updates */}
            {official.length > 0 && (
                <ResourceBentoCard
                    title="From Anthropic"
                    subtitle="Official updates & announcements"
                    icon={SparklesIcon}
                    resources={official}
                    type="official"
                    href="/resources?type=official"
                    className="lg:col-span-1"
                />
            )}
        </div>
    );
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container py-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Library</h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Curated collection of the best AI coding tools, tutorials, and community vibes.
                    </p>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex gap-10">
                    {/* Sidebar */}
                    <Suspense fallback={
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="space-y-2 pt-8">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </aside>
                    }>
                        <CategorySidebar currentType={params.type} currentPlatform={params.platform} />
                    </Suspense>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Suspense fallback={
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse h-[500px]" />
                                ))}
                            </div>
                        }>
                            <ResourcesList searchParams={searchParams} />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Fixed Submit Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <Link
                    href="/submit/resource"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all font-medium"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Submit Resource</span>
                </Link>
            </div>
        </div>
    );
}
