import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
    Play,
    User,
    ExternalLink,
} from "lucide-react";
import {
    ResourcesIcon,
    YouTubeIcon,
    GuidesIcon,
    XIcon
} from "@/components/icons";
import { ResourceCard } from "@/components/resource-card";


export const metadata: Metadata = {
    title: "Resources | Vibe Stack",
    description: "Videos, tutorials, and blog posts about AI coding tools",
};

const CATEGORIES = [
    { value: "", label: "All Resources", icon: ResourcesIcon },
    { value: "youtube", label: "YouTube Videos", icon: YouTubeIcon },
    { value: "blog", label: "Blog Posts", icon: ResourcesIcon },
    { value: "tutorial", label: "Tutorials", icon: GuidesIcon },
    { value: "social", label: "Social Posts", icon: XIcon },
];


const TYPE_CONFIG: Record<string, { color: string; bgColor: string }> = {
    youtube: { color: "text-red-400", bgColor: "bg-red-500/10" },
    blog: { color: "text-blue-400", bgColor: "bg-blue-500/10" },
    tutorial: { color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    social: { color: "text-purple-400", bgColor: "bg-purple-500/10" },
};

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
            <nav className="sticky top-24 space-y-1">
                {CATEGORIES.map((cat) => {
                    const count = cat.value
                        ? counts.find(c => c.type === cat.value)?._count.id || 0
                        : total;
                    const isActive = currentType === cat.value || (!currentType && !cat.value);

                    return (
                        <Link
                            key={cat.value}
                            href={cat.value ? `/resources?type=${cat.value}` : "/resources"}
                            className={cn(
                                "flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors",
                                isActive
                                    ? "bg-muted text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <cat.icon className="h-4 w-4" />
                                <span>{cat.label}</span>
                            </div>
                            <span className="text-xs tabular-nums">{count}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

async function ResourcesList({ searchParams }: { searchParams: ResourcesPageProps["searchParams"] }) {
    const params = await searchParams;
    const { type } = params;

    const where: Record<string, unknown> = { status: "APPROVED" };
    if (type) where.type = type;

    const resources = await prisma.resource.findMany({
        where,
        orderBy: [{ featured: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
        take: 50,
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

    // Separate by type for mixed display
    const youtubeResources = resources.filter(r => r.type === "youtube");
    const otherResources = resources.filter(r => r.type !== "youtube");

    // If filtering by YouTube specifically
    if (type === "youtube") {
        return (
            <div className="flex-1">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {youtubeResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            </div>
        );
    }

    // If filtering by non-YouTube type
    if (type && type !== "youtube") {
        return (
            <div className="flex-1">
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {otherResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Mixed view - YouTube first, then others
    return (
        <div className="flex-1 space-y-10">
            {/* YouTube Videos Section */}
            {youtubeResources.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Featured Videos</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {youtubeResources.slice(0, 6).map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </section>
            )}

            {/* Blog & Tutorials Section */}
            {otherResources.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4">Articles & Tutorials</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {otherResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <Suspense fallback={
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
                                ))}
                            </div>
                        </aside>
                    }>
                        <CategorySidebar currentType={params.type} />
                    </Suspense>

                    {/* Main Content */}
                    <Suspense fallback={
                        <div className="flex-1 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                                        <div className="aspect-video bg-muted" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-muted rounded w-1/4" />
                                            <div className="h-5 bg-muted rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }>
                        <ResourcesList searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>

            {/* Fixed Submit Button */}
            <div className="fixed bottom-6 left-6 z-50">
                <Link
                    href="/submit/resource"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border shadow-lg hover:bg-accent transition-colors font-medium"
                >
                    Submit +
                </Link>
            </div>
        </div>
    );
}
