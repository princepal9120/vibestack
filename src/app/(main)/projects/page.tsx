import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";
import { FilterBar } from "@/components/filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Projects | Vibe Stack",
    description: "Explore projects built with AI coding tools",
};

interface ProjectsPageProps {
    searchParams: Promise<{
        platform?: string;
        category?: string;
        search?: string;
        sort?: string;
        page?: string;
        view?: string;
    }>;
}

async function ProjectsGrid({
    searchParams,
}: {
    searchParams: ProjectsPageProps["searchParams"];
}) {
    const params = await searchParams;
    const { platform, category, search, sort = "newest", page = "1", view = "list" } = params;

    const pageNum = parseInt(page);
    const limit = view === "list" ? 20 : 12;
    const skip = (pageNum - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (platform) {
        where.platforms = { has: platform };
    }

    if (category) {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    // Build orderBy
    let orderBy: Record<string, string>[] = [];
    switch (sort) {
        case "trending":
            orderBy = [{ upvoteCount: "desc" }, { createdAt: "desc" }];
            break;
        case "popular":
            orderBy = [{ viewCount: "desc" }, { createdAt: "desc" }];
            break;
        default:
            orderBy = [{ createdAt: "desc" }];
    }

    const [projects, total] = await Promise.all([
        prisma.project.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                author: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        }),
        prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or search terms
                </p>
                <Link
                    href="/projects/new"
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
                >
                    Be the first to submit
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Projects List/Grid */}
            <div className={cn(
                view === "list"
                    ? "space-y-3"
                    : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            )}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        variant={view === "list" ? "list" : "grid"}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const p = i + 1;
                        const searchParamsObj = new URLSearchParams();
                        if (platform) searchParamsObj.set("platform", platform);
                        if (category) searchParamsObj.set("category", category);
                        if (search) searchParamsObj.set("search", search);
                        if (sort) searchParamsObj.set("sort", sort);
                        if (view) searchParamsObj.set("view", view);
                        searchParamsObj.set("page", p.toString());

                        return (
                            <a
                                key={p}
                                href={`/projects?${searchParamsObj.toString()}`}
                                className={cn(
                                    "inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                                    p === pageNum
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-border hover:bg-accent"
                                )}
                            >
                                {p}
                            </a>
                        );
                    })}
                    {totalPages > 5 && (
                        <span className="inline-flex h-10 items-center px-2 text-muted-foreground">
                            ...
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

function ProjectsGridSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-16 w-14 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

// Sort tabs component
function SortTabs({ currentSort }: { currentSort: string }) {
    const tabs = [
        { value: "newest", label: "Newest" },
        { value: "trending", label: "Trending" },
        { value: "popular", label: "Popular" },
    ];

    return (
        <div className="flex gap-1 rounded-lg bg-muted p-1">
            {tabs.map((tab) => (
                <a
                    key={tab.value}
                    href={`/projects?sort=${tab.value}`}
                    className={cn(
                        "inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                        currentSort === tab.value
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {tab.label}
                </a>
            ))}
        </div>
    );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
    const params = await searchParams;
    const sort = params.sort || "newest";

    return (
        <div className="dark-mode min-h-screen">
            <div className="container py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                        <p className="mt-1 text-muted-foreground">
                            Explore projects built with AI coding tools
                        </p>
                    </div>
                    <SortTabs currentSort={sort} />
                </div>

                {/* Filter Bar */}
                <Suspense fallback={<div className="h-12 animate-pulse bg-muted rounded-lg" />}>
                    <FilterBar />
                </Suspense>

                {/* Projects */}
                <Suspense fallback={<ProjectsGridSkeleton />}>
                    <ProjectsGrid searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
