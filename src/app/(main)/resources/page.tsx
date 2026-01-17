import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

import {
    ResourcesIcon,
    YouTubeIcon,
    GuidesIcon,
    XIcon
} from "@/components/icons";
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


const TYPE_CONFIG: Record<string, { color: string; bgColor: string }> = {
    youtube: { color: "text-red-400", bgColor: "bg-red-500/10" },
    blog: { color: "text-blue-400", bgColor: "bg-blue-500/10" },
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
            <div className="sticky top-24">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">
                    Collections
                </h3>
                <nav className="space-y-1">
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

// ... helper renderResourceCard ...

// ... ResourcesList ...

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
                    <Suspense fallback={
                        <div className="flex-1 space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse h-[300px]" />
                                ))}
                            </div>
                        </div>
                    }>
                        <ResourcesList searchParams={searchParams} />
                    </Suspense>
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
