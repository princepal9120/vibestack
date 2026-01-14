import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
    Database,
    Cloud,
    Monitor,
    Paintbrush,
    Zap,
    FileText,
    ExternalLink,
    Copy,
    Server,
    ArrowRight,
    Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
    title: "MCP Servers | Vibe Stack",
    description: "Browse Model Context Protocol servers for Claude Code and other AI coding tools",
};

const CATEGORY_CONFIG = {
    database: { icon: Database, label: "Database", color: "bg-blue-500 text-white" },
    cloud: { icon: Cloud, label: "Cloud", color: "bg-sky-500 text-white" },
    monitoring: { icon: Monitor, label: "Monitoring", color: "bg-amber-500 text-white" },
    design: { icon: Paintbrush, label: "Design", color: "bg-pink-500 text-white" },
    productivity: { icon: Zap, label: "Productivity", color: "bg-emerald-500 text-white" },
    devops: { icon: Server, label: "DevOps", color: "bg-purple-500 text-white" },
};

interface MCPPageProps {
    searchParams: Promise<{
        category?: string;
    }>;
}

async function MCPServersList({ searchParams }: { searchParams: MCPPageProps["searchParams"] }) {
    const params = await searchParams;
    const { category } = params;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const mcpServers = await prisma.mCPServer.findMany({
        where,
        orderBy: [{ featured: "desc" }, { useCount: "desc" }, { createdAt: "desc" }],
    });

    if (mcpServers.length === 0) {
        return (
            <div className="text-center py-16">
                <Server className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No MCP servers found</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Check back soon for Model Context Protocol integrations
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mcpServers.map((mcp) => {
                const config = CATEGORY_CONFIG[mcp.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.productivity;
                const Icon = config.icon;

                return (
                    <div
                        key={mcp.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    >
                        {/* Header */}
                        <div className="p-5 pb-3 flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
                                {mcp.iconUrl ? (
                                    <img src={mcp.iconUrl} alt={mcp.name} className="h-6 w-6" />
                                ) : (
                                    <Icon className="h-6 w-6 text-primary" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                        {mcp.name}
                                    </h3>
                                    {mcp.featured && (
                                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                        config.color
                                    )}>
                                        <Icon className="h-3 w-3" />
                                        {config.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {mcp.provider}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="px-5 pb-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {mcp.description}
                            </p>
                        </div>

                        {/* Install Command */}
                        {mcp.installCommand && (
                            <div className="mx-5 mb-3 relative">
                                <pre className="rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs font-mono text-muted-foreground overflow-x-auto">
                                    <code>{mcp.installCommand}</code>
                                </pre>
                                <button
                                    className="absolute top-1.5 right-1.5 p-1.5 rounded bg-card border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-accent"
                                    title="Copy command"
                                >
                                    <Copy className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto px-5 py-3 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    {mcp.useCount} uses
                                </span>
                                {mcp.platforms.slice(0, 2).map((platform: string) => (
                                    <span
                                        key={platform}
                                        className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                {mcp.docsUrl && (
                                    <a
                                        href={mcp.docsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-accent transition-colors"
                                        title="Documentation"
                                    >
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </a>
                                )}
                                {mcp.repoUrl && (
                                    <a
                                        href={mcp.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded hover:bg-accent transition-colors"
                                        title="Repository"
                                    >
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
        { value: "database", label: "Database", icon: Database },
        { value: "cloud", label: "Cloud", icon: Cloud },
        { value: "monitoring", label: "Monitoring", icon: Monitor },
        { value: "design", label: "Design", icon: Paintbrush },
        { value: "productivity", label: "Productivity", icon: Zap },
        { value: "devops", label: "DevOps", icon: Server },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.value || (!currentCategory && !cat.value);
                return (
                    <a
                        key={cat.value}
                        href={cat.value ? `/collections/mcps?category=${cat.value}` : "/collections/mcps"}
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

export default async function MCPsPage({ searchParams }: MCPPageProps) {
    const params = await searchParams;

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Server className="h-4 w-4" />
                        MCP Servers
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Model Context Protocol Servers
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Extend Claude Code with integrations for databases, cloud services, design tools, and more
                    </p>
                    <a
                        href="https://docs.anthropic.com/en/docs/claude-code/mcp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                    >
                        Learn about MCP <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* MCP Servers Grid */}
                <Suspense fallback={
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="p-5 flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-muted rounded w-1/2" />
                                        <div className="h-4 bg-muted rounded w-1/4" />
                                    </div>
                                </div>
                                <div className="px-5 pb-5 space-y-2">
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-8 bg-muted rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <MCPServersList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
