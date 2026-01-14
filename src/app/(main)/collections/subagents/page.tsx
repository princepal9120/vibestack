import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
    Code,
    Layers,
    Server,
    Box,
    TestTube,
    Smartphone,
    Database,
    Copy,
    Sparkles,
    User,
    ExternalLink,
    ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Sub-Agents | Vibe Stack",
    description: "Browse Claude Code sub-agent prompts for React, Python, TypeScript, and more",
};

const CATEGORY_CONFIG = {
    frontend: { icon: Layers, label: "Frontend", color: "bg-blue-500 text-white" },
    backend: { icon: Server, label: "Backend", color: "bg-emerald-500 text-white" },
    fullstack: { icon: Code, label: "Full Stack", color: "bg-purple-500 text-white" },
    devops: { icon: Box, label: "DevOps", color: "bg-amber-500 text-white" },
    testing: { icon: TestTube, label: "Testing", color: "bg-pink-500 text-white" },
    mobile: { icon: Smartphone, label: "Mobile", color: "bg-cyan-500 text-white" },
    database: { icon: Database, label: "Database", color: "bg-orange-500 text-white" },
};

const LANGUAGE_COLORS: Record<string, string> = {
    typescript: "bg-blue-500/10 text-blue-400",
    javascript: "bg-yellow-500/10 text-yellow-400",
    python: "bg-green-500/10 text-green-400",
    go: "bg-cyan-500/10 text-cyan-400",
    rust: "bg-orange-500/10 text-orange-400",
    java: "bg-red-500/10 text-red-400",
    "c#": "bg-purple-500/10 text-purple-400",
    "c++": "bg-pink-500/10 text-pink-400",
    swift: "bg-orange-500/10 text-orange-400",
    kotlin: "bg-violet-500/10 text-violet-400",
};

interface SubAgentsPageProps {
    searchParams: Promise<{
        category?: string;
        language?: string;
    }>;
}

async function SubAgentsList({ searchParams }: { searchParams: SubAgentsPageProps["searchParams"] }) {
    const params = await searchParams;
    const { category, language } = params;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (language) where.language = language;

    const subAgents = await prisma.subAgent.findMany({
        where,
        orderBy: [{ featured: "desc" }, { useCount: "desc" }, { createdAt: "desc" }],
    });

    if (subAgents.length === 0) {
        return (
            <div className="text-center py-16">
                <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No sub-agents found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for role-specific AI agent prompts
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {subAgents.map((agent) => {
                const config = CATEGORY_CONFIG[agent.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.fullstack;
                const Icon = config.icon;
                const langColor = agent.language ? LANGUAGE_COLORS[agent.language.toLowerCase()] || "bg-muted text-muted-foreground" : "";

                return (
                    <div
                        key={agent.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                    >
                        {/* Header */}
                        <div className="p-5 pb-3 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                        {agent.name}
                                    </h3>
                                    {agent.featured && (
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {agent.role}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold",
                                    config.color
                                )}>
                                    <Icon className="h-3 w-3" />
                                    {config.label}
                                </span>
                                {agent.language && (
                                    <span className={cn(
                                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        langColor
                                    )}>
                                        {agent.language}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* System Prompt Preview */}
                        <div className="mx-5 mb-3 relative">
                            <div className="rounded-xl bg-muted/30 border border-border overflow-hidden">
                                <div className="px-3 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">System Prompt</span>
                                    <button
                                        className="p-1.5 rounded bg-card border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-accent"
                                        title="Copy prompt"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </button>
                                </div>
                                <pre className="p-4 text-sm font-mono text-muted-foreground overflow-hidden max-h-32">
                                    <code className="line-clamp-4">
                                        {agent.systemPrompt.slice(0, 300)}
                                        {agent.systemPrompt.length > 300 && "..."}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        {/* When to Use */}
                        {agent.whenToUse && (
                            <div className="mx-5 mb-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs font-medium text-primary mb-1">When to use</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {agent.whenToUse}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto px-5 py-3 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    {agent.useCount} uses
                                </span>
                                {agent.framework && (
                                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        {agent.framework}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {agent.authorName && (
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                                            {agent.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        {agent.authorName}
                                    </span>
                                )}
                                {agent.authorUrl && (
                                    <a
                                        href={agent.authorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-accent transition-colors"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                    </a>
                                )}
                            </div>
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
        { value: "frontend", label: "Frontend", icon: Layers },
        { value: "backend", label: "Backend", icon: Server },
        { value: "fullstack", label: "Full Stack", icon: Code },
        { value: "devops", label: "DevOps", icon: Box },
        { value: "testing", label: "Testing", icon: TestTube },
        { value: "mobile", label: "Mobile", icon: Smartphone },
        { value: "database", label: "Database", icon: Database },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.value || (!currentCategory && !cat.value);
                return (
                    <a
                        key={cat.value}
                        href={cat.value ? `/collections/subagents?category=${cat.value}` : "/collections/subagents"}
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

export default async function SubAgentsPage({ searchParams }: SubAgentsPageProps) {
    const params = await searchParams;

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <User className="h-4 w-4" />
                        Sub-Agents
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Claude Code Sub-Agent Prompts
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Copy-paste ready prompts for React, Python, TypeScript, and more. Use sub-agents to delegate specialized tasks.
                    </p>
                    <a
                        href="https://docs.anthropic.com/en/docs/claude-code/sub-agents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                    >
                        Learn about sub-agents <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* Sub-Agents Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 lg:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-muted rounded w-1/3" />
                                    <div className="h-4 bg-muted rounded w-2/3" />
                                </div>
                                <div className="mx-5 mb-5 h-32 bg-muted rounded-xl" />
                            </div>
                        ))}
                    </div>
                }>
                    <SubAgentsList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
