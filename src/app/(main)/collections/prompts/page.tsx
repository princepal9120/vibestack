import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Copy, Sparkles, Code, FileText, Bug, Pencil, MessageSquare, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Prompts & Skills | Vibe Stack",
    description: "Claude skills, prompt templates, and patterns for AI coding",
};

const CATEGORY_CONFIG = {
    coding: { icon: Code, label: "Coding", color: "bg-blue-500 text-white", gradient: "from-blue-500/20 to-blue-600/10" },
    debugging: { icon: Bug, label: "Debugging", color: "bg-red-500 text-white", gradient: "from-red-500/20 to-red-600/10" },
    documentation: { icon: FileText, label: "Documentation", color: "bg-emerald-500 text-white", gradient: "from-emerald-500/20 to-emerald-600/10" },
    refactoring: { icon: Pencil, label: "Refactoring", color: "bg-amber-500 text-white", gradient: "from-amber-500/20 to-amber-600/10" },
};

interface PromptsPageProps {
    searchParams: Promise<{
        category?: string;
        platform?: string;
    }>;
}

async function PromptsList({ searchParams }: { searchParams: PromptsPageProps["searchParams"] }) {
    const params = await searchParams;
    const { category, platform } = params;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (platform) where.platformId = platform;

    const prompts = await prisma.promptTemplate.findMany({
        where,
        include: {
            platform: {
                select: {
                    name: true,
                    platformId: true,
                },
            },
        },
        orderBy: [{ useCount: "desc" }, { createdAt: "desc" }],
    });

    if (prompts.length === 0) {
        return (
            <div className="text-center py-16">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No prompts found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for Claude skills and prompt templates
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {prompts.map((prompt) => {
                const config = CATEGORY_CONFIG[prompt.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.coding;
                const Icon = config.icon;

                return (
                    <div
                        key={prompt.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                    >
                        {/* Header */}
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

                            {/* Uses count */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1 rounded-md bg-card/80 backdrop-blur px-2 py-1 text-xs font-medium text-foreground shadow">
                                    <Zap className="h-3 w-3" />
                                    {prompt.useCount} uses
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="mt-8 h-12 w-12 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center shadow">
                                <MessageSquare className="h-6 w-6 text-foreground" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                            {/* Platform */}
                            <span className="text-xs font-medium text-muted-foreground mb-2">
                                {prompt.platform.name}
                            </span>

                            {/* Title */}
                            <h3 className="font-bold text-lg leading-snug line-clamp-2">
                                {prompt.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {prompt.description}
                            </p>

                            {/* Prompt Preview */}
                            <div className="relative mt-4">
                                <pre className="rounded-xl bg-muted/50 border border-border p-4 text-sm overflow-hidden font-mono text-muted-foreground leading-relaxed">
                                    <code className="line-clamp-4">
                                        {prompt.prompt.slice(0, 200)}
                                        {prompt.prompt.length > 200 && "..."}
                                    </code>
                                </pre>

                                {/* Copy button */}
                                <button
                                    className="absolute top-3 right-3 p-2 rounded-lg bg-card border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-accent shadow-sm"
                                    title="Copy prompt"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Use Case */}
                            {prompt.useCase && (
                                <p className="mt-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                                    <strong className="text-foreground">When to use:</strong> {prompt.useCase}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function CategoryFilter({ currentCategory }: { currentCategory?: string }) {
    const categories = [
        { value: "", label: "All", icon: Sparkles },
        { value: "coding", label: "Coding", icon: Code },
        { value: "debugging", label: "Debugging", icon: Bug },
        { value: "documentation", label: "Docs", icon: FileText },
        { value: "refactoring", label: "Refactoring", icon: Pencil },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.value || (!currentCategory && !cat.value);
                return (
                    <a
                        key={cat.value}
                        href={cat.value ? `/collections/prompts?category=${cat.value}` : "/collections/prompts"}
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

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
    const params = await searchParams;

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <MessageSquare className="h-4 w-4" />
                        Prompts
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Prompts & Skills
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Claude skills, prompt templates, and patterns for AI coding
                    </p>
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* Prompts Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="h-28 bg-muted" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-20 bg-muted rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <PromptsList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
