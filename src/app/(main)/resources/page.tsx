import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { PlusIcon, SparklesIcon } from "lucide-react";

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

interface ResourcesPageProps {
    searchParams: Promise<{
        type?: string;
    }>;
}

async function CategorySidebar({ currentType }: { currentType?: string }) {
    const counts = await prisma.resource.groupBy({
        by: ["type"],
        _count: { id: true },
        where: { status: "APPROVED" },
    });

    const total = counts.reduce((acc, c) => acc + c._count.id, 0);

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                    Collections
                </h3>
                <nav className="space-y-1">
                    {CATEGORIES.map((cat) => {
                        let count = 0;

                        if (!cat.value) {
                            // All Resources
                            count = total;
                        } else if (cat.value === "blog") {
                            // Sum blog and article types
                            count = counts
                                .filter(c => c.type === "blog" || c.type === "article")
                                .reduce((acc, c) => acc + c._count.id, 0);
                        } else {
                            // Direct match for other types
                            count = counts.find(c => c.type === cat.value)?._count.id || 0;
                        }

                        const isActive = currentType === cat.value || (!currentType && !cat.value);

                        return (
                            <Link
                                key={cat.value}
                                href={cat.value ? `/resources?type=${cat.value}` : "/resources"}
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
        </aside>
    );
}

async function ResourcesList({ searchParams }: { searchParams: ResourcesPageProps["searchParams"] }) {
    const params = await searchParams;
    const { type } = params;

    // Fetch all resources sorted
    // Fetch all resources sorted
    const where: Record<string, unknown> = { status: "APPROVED" };

    if (type === "blog") {
        where.type = { in: ["blog", "article"] };
    } else if (type) {
        where.type = type;
    }

    const resources = await prisma.resource.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 100,
    });

    if (resources.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <ResourcesIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground text-sm">
                    Be the first to{" "}
                    <Link href="/submit/resource" className="underline hover:text-foreground">
                        submit a resource
                    </Link>
                </p>
            </div>
        );
    }

    // Filter by type
    const videos = resources.filter(r => r.type === "youtube");
    const tweets = resources.filter(r => r.type === "social");
    const blogs = resources.filter(r => r.type === "blog" || r.type === "article");

    // Identify "Official" resources (heuristic: author name)
    const official = resources.filter(r => {
        const author = r.author?.toLowerCase() || "";
        return author.includes("anthropic") || author.includes("google") || author.includes("openai") || r.tags.includes("official");
    });

    // If a specific type filter is active, show the grid of cards
    // If NO filter (Library view), show the Bento Grid
    if (type) {
        // Standard Grid for filtered view
        return (
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
        );
    }

    // Bento Grid View (Library Dashboard)
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

            {/* Official / Featured Updates (Optional 4th card example) */}
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
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />
                                ))}
                            </div>
                        </aside>
                    }>
                        <CategorySidebar currentType={params.type} />
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

            {/* Fixed Submit Button - Refined */}
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
