import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, Lightbulb, Zap, BookOpen, Settings, Bug, FileText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Workflows & Guides | Vibe Stack",
    description: "Best practices, hacks, and workflow guides for AI coding tools",
};

const CATEGORY_CONFIG = {
    setup: { icon: Settings, label: "Setup", color: "bg-blue-500 text-white", gradient: "from-blue-500/20 to-blue-600/10" },
    debugging: { icon: Bug, label: "Debugging", color: "bg-red-500 text-white", gradient: "from-red-500/20 to-red-600/10" },
    refactoring: { icon: Zap, label: "Refactoring", color: "bg-amber-500 text-white", gradient: "from-amber-500/20 to-amber-600/10" },
    testing: { icon: FileText, label: "Testing", color: "bg-emerald-500 text-white", gradient: "from-emerald-500/20 to-emerald-600/10" },
    rules: { icon: BookOpen, label: "Rules", color: "bg-purple-500 text-white", gradient: "from-purple-500/20 to-purple-600/10" },
    tips: { icon: Lightbulb, label: "Tips & Hacks", color: "bg-orange-500 text-white", gradient: "from-orange-500/20 to-orange-600/10" },
};

const DIFFICULTY_COLORS = {
    beginner: "bg-emerald-500/10 text-emerald-500",
    intermediate: "bg-amber-500/10 text-amber-500",
    advanced: "bg-red-500/10 text-red-500",
};

interface WorkflowsPageProps {
    searchParams: Promise<{
        category?: string;
        platform?: string;
    }>;
}

async function WorkflowsList({ searchParams }: { searchParams: WorkflowsPageProps["searchParams"] }) {
    const params = await searchParams;
    const { category, platform } = params;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (platform) where.platformId = platform;

    const workflows = await prisma.workflow.findMany({
        where,
        include: {
            platform: {
                select: {
                    name: true,
                    platformId: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    if (workflows.length === 0) {
        return (
            <div className="text-center py-16">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No workflows found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for best practices and guides
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => {
                const config = CATEGORY_CONFIG[workflow.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.tips;
                const Icon = config.icon;
                const difficultyColor = DIFFICULTY_COLORS[workflow.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.beginner;

                return (
                    <Link
                        key={workflow.id}
                        href={`/workflows/${workflow.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    >
                        {/* Header with gradient */}
                        <div className={cn(
                            "relative overflow-hidden bg-gradient-to-br p-5",
                            config.gradient
                        )}>
                            {/* Category Badge */}
                            <div className="absolute top-4 right-4">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold shadow-lg",
                                    config.color
                                )}>
                                    <Icon className="h-3 w-3" />
                                    {config.label}
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="h-12 w-12 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center shadow">
                                <Icon className="h-6 w-6 text-foreground" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                            {/* Platform & Difficulty */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {workflow.platform.name}
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                    difficultyColor
                                )}>
                                    {workflow.difficulty}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                {workflow.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {workflow.description}
                            </p>

                            {/* Footer */}
                            <div className="mt-auto pt-4 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Eye className="h-3.5 w-3.5" />
                                    {workflow.viewCount} views
                                </span>
                                <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

function CategoryFilter({ currentCategory }: { currentCategory?: string }) {
    const categories = [
        { value: "", label: "All", icon: Sparkles },
        { value: "rules", label: "Rules", icon: BookOpen },
        { value: "setup", label: "Setup", icon: Settings },
        { value: "debugging", label: "Debugging", icon: Bug },
        { value: "refactoring", label: "Refactoring", icon: Zap },
        { value: "testing", label: "Testing", icon: FileText },
        { value: "tips", label: "Tips", icon: Lightbulb },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.value || (!currentCategory && !cat.value);
                return (
                    <a
                        key={cat.value}
                        href={cat.value ? `/workflows?category=${cat.value}` : "/workflows"}
                        className={cn(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                    </a>
                );
            })}
        </div>
    );
}

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
    const params = await searchParams;

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Zap className="h-4 w-4" />
                        Workflows
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Workflows & Best Practices
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Rules, hacks, and workflow guides for AI coding tools
                    </p>
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* Workflows Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="h-24 bg-muted" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <WorkflowsList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
