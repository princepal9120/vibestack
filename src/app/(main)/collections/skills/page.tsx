import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
    Copy,
    Sparkles,
    FileText,
    Code,
    Database,
    Zap,
    Bot,
    CheckCircle2,
    ExternalLink,
    ChevronRight,
    Wand2,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Agent Skills | Vibe Stack",
    description: "Modular capabilities that extend AI coding tools. Use with Claude Code, Cursor, Gemini CLI, and more.",
};

const CATEGORY_CONFIG = {
    document: {
        icon: FileText,
        label: "Document",
        color: "bg-blue-500 text-white",
        gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
    },
    coding: {
        icon: Code,
        label: "Coding",
        color: "bg-purple-500 text-white",
        gradient: "from-purple-500/20 via-purple-600/10 to-transparent",
    },
    data: {
        icon: Database,
        label: "Data",
        color: "bg-emerald-500 text-white",
        gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
    },
    workflow: {
        icon: Zap,
        label: "Workflow",
        color: "bg-amber-500 text-white",
        gradient: "from-amber-500/20 via-amber-600/10 to-transparent",
    },
    automation: {
        icon: Bot,
        label: "Automation",
        color: "bg-pink-500 text-white",
        gradient: "from-pink-500/20 via-pink-600/10 to-transparent",
    },
};

const PLATFORM_COLORS: Record<string, string> = {
    "claude-code": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "cursor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "gemini-cli": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "opencode": "bg-green-500/10 text-green-400 border-green-500/20",
    "copilot": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "windsurf": "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

interface SkillsPageProps {
    searchParams: Promise<{
        category?: string;
    }>;
}

async function SkillsList({ searchParams }: { searchParams: SkillsPageProps["searchParams"] }) {
    const params = await searchParams;
    const { category } = params;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const skills = await prisma.skill.findMany({
        where,
        orderBy: [{ featured: "desc" }, { useCount: "desc" }, { createdAt: "desc" }],
    });

    if (skills.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                    <Wand2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No skills found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Agent Skills are modular capabilities that extend AI coding tools. Check back soon for new additions.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => {
                const config = CATEGORY_CONFIG[skill.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.coding;
                const Icon = config.icon;

                return (
                    <div
                        key={skill.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30"
                    >
                        {/* Gradient Header */}
                        <div className={cn(
                            "relative p-6 pb-16 bg-gradient-to-br",
                            config.gradient
                        )}>
                            {/* Badges */}
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
                                    config.color
                                )}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {config.label}
                                </span>

                                {skill.featured && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                                        <Sparkles className="h-3 w-3" />
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Provider Badge */}
                            {skill.provider === "official" && (
                                <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    Official
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 -mt-10 relative z-10">
                            {/* Icon */}
                            <div className="mb-4 h-14 w-14 rounded-2xl bg-card border-2 border-border shadow-lg flex items-center justify-center">
                                {skill.iconUrl ? (
                                    <img src={skill.iconUrl} alt={skill.name} className="h-7 w-7" />
                                ) : (
                                    <Wand2 className="h-7 w-7 text-primary" />
                                )}
                            </div>

                            {/* Title & Tagline */}
                            <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                                {skill.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {skill.tagline}
                            </p>

                            {/* Platforms */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {skill.platforms.slice(0, 4).map((platform: string) => (
                                    <span
                                        key={platform}
                                        className={cn(
                                            "rounded-md border px-2 py-0.5 text-[10px] font-medium",
                                            PLATFORM_COLORS[platform] || "bg-muted text-muted-foreground border-border"
                                        )}
                                    >
                                        {platform}
                                    </span>
                                ))}
                                {skill.platforms.length > 4 && (
                                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        +{skill.platforms.length - 4}
                                    </span>
                                )}
                            </div>

                            {/* Triggers */}
                            {skill.triggers.length > 0 && (
                                <div className="text-xs text-muted-foreground mb-4">
                                    <span className="font-medium text-foreground">Triggers: </span>
                                    {skill.triggers.slice(0, 2).join(", ")}
                                    {skill.triggers.length > 2 && `, +${skill.triggers.length - 2} more`}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    {skill.useCount.toLocaleString()} uses
                                </span>
                                {skill.authorName && (
                                    <span className="text-xs text-muted-foreground">
                                        by {skill.authorName}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 rounded-lg bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-foreground"
                                    title="Copy instructions"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                {skill.repoUrl && (
                                    <a
                                        href={skill.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-foreground"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <Link
                            href={`/collections/skills/${skill.slug}`}
                            className="absolute inset-0 z-20"
                        >
                            <span className="sr-only">View {skill.name}</span>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

function CategoryFilter({ currentCategory }: { currentCategory?: string }) {
    const categories = [
        { value: "", label: "All Skills", icon: Sparkles },
        { value: "document", label: "Document", icon: FileText },
        { value: "coding", label: "Coding", icon: Code },
        { value: "data", label: "Data", icon: Database },
        { value: "workflow", label: "Workflow", icon: Zap },
        { value: "automation", label: "Automation", icon: Bot },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.value || (!currentCategory && !cat.value);
                return (
                    <a
                        key={cat.value}
                        href={cat.value ? `/collections/skills?category=${cat.value}` : "/collections/skills"}
                        className={cn(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium transition-all",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/30"
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

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-12 space-y-12">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8 md:p-12">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <Wand2 className="h-4 w-4" />
                            Agent Skills
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Extend AI with Skills
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Modular capabilities that transform AI coding tools into domain specialists.
                            Works with Claude Code, Cursor, Gemini CLI, OpenCode, and more.
                        </p>
                        <a
                            href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-primary hover:underline"
                        >
                            Learn about Agent Skills
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary blur-3xl" />
                        <div className="absolute bottom-10 right-32 w-24 h-24 rounded-full bg-purple-500 blur-3xl" />
                    </div>
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* Skills Grid */}
                <Suspense fallback={
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
                                <div className="h-24 bg-muted" />
                                <div className="p-6 space-y-4">
                                    <div className="h-14 w-14 rounded-2xl bg-muted" />
                                    <div className="h-5 bg-muted rounded w-2/3" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="flex gap-2">
                                        <div className="h-5 bg-muted rounded w-16" />
                                        <div className="h-5 bg-muted rounded w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <SkillsList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
