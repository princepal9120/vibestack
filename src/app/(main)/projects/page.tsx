import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";
import { FilterBar } from "@/components/filter-bar";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Projects",
    description: "Explore projects built with AI coding tools",
};

interface ProjectsPageProps {
    searchParams: Promise<{
        platform?: string;
        category?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

async function ProjectsGrid({
    searchParams,
}: {
    searchParams: ProjectsPageProps["searchParams"];
}) {
    const params = await searchParams;
    const { platform, category, search, sort = "newest", page = "1" } = params;

    const pageNum = parseInt(page);
    const limit = 12;
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
                <p className="text-lg text-muted-foreground">No projects found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters or search terms
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <a
                            key={p}
                            href={`/projects?${new URLSearchParams({
                                ...(platform && { platform }),
                                ...(category && { category }),
                                ...(search && { search }),
                                ...(sort && { sort }),
                                page: p.toString(),
                            }).toString()}`}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${p === pageNum
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background hover:bg-muted"
                                }`}
                        >
                            {p}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
}

function ProjectsGridSkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-4 space-y-4">
                    <Skeleton className="aspect-video rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="mt-2 text-muted-foreground">
                    Explore projects built with AI coding tools
                </p>
            </div>

            <Suspense fallback={<div className="h-20 animate-pulse bg-muted rounded-lg" />}>
                <FilterBar />
            </Suspense>

            <Suspense fallback={<ProjectsGridSkeleton />}>
                <ProjectsGrid searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
