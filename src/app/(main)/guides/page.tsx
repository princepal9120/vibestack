import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, Eye, Rocket, Target, BookOpen, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "End-to-End Guides | Vibe Stack",
    description: "Complete journey guides showing what you can build with AI coding tools",
};

async function GuidesList() {
    const guides = await prisma.endToEndGuide.findMany({
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    if (guides.length === 0) {
        return (
            <div className="text-center py-16">
                <Rocket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No guides found yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for complete end-to-end journey guides
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide, index) => {
                // Alternate gradient colors for visual variety
                const gradients = [
                    "from-purple-500/20 via-purple-600/10 to-transparent",
                    "from-orange-500/20 via-orange-600/10 to-transparent",
                    "from-blue-500/20 via-blue-600/10 to-transparent",
                    "from-emerald-500/20 via-emerald-600/10 to-transparent",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                    <Link
                        key={guide.id}
                        href={`/guides/${guide.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    >
                        {/* Header with gradient */}
                        <div className={cn(
                            "relative overflow-hidden bg-gradient-to-br p-6 pb-12",
                            gradient
                        )}>
                            {/* Featured Badge */}
                            {guide.featured && (
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                                        <Target className="h-3 w-3" />
                                        FEATURED
                                    </span>
                                </div>
                            )}

                            {/* Duration badge */}
                            {guide.duration && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-card/80 backdrop-blur px-2.5 py-1 text-xs font-medium text-foreground shadow">
                                        <Clock className="h-3 w-3" />
                                        {guide.duration}
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className="mt-8 mb-2">
                                <Rocket className="h-10 w-10 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-6 -mt-6 relative z-10">
                            {/* Title */}
                            <h3 className="text-xl font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {guide.title}
                            </h3>

                            {/* Outcome highlight */}
                            {guide.outcome && (
                                <p className="mt-3 text-base font-medium text-primary flex items-start gap-2">
                                    <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                                    {guide.outcome}
                                </p>
                            )}

                            {/* Description */}
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {guide.description}
                            </p>

                            {/* Tags */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {guide.platforms.slice(0, 2).map((platform: string) => (
                                    <span
                                        key={platform}
                                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                                    >
                                        {platform}
                                    </span>
                                ))}
                                {guide.techStack.slice(0, 3).map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-4 flex items-center justify-between">
                                {/* Author */}
                                {guide.authorName && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                            {guide.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {guide.authorName}
                                        </span>
                                    </div>
                                )}

                                {/* Views & CTA */}
                                <div className="flex items-center gap-3 ml-auto">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Eye className="h-3.5 w-3.5" />
                                        {guide.viewCount}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read <ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default async function GuidesPage() {
    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <BookOpen className="h-4 w-4" />
                        Guides
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        End-to-End Guides
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Complete journey guides showing what you can build with AI coding tools—from idea to shipped product
                    </p>
                </div>

                {/* Guides Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="h-32 bg-muted" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <GuidesList />
                </Suspense>
            </div>
        </div>
    );
}
