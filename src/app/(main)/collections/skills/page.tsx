import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
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
    Copy,
    Folder,
    Terminal,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";

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
    "codex": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

// Generate SKILL.md formatted content
function generateSkillMd(skill: {
    name: string;
    slug: string;
    tagline: string;
    instructions: string;
    triggers: string[];
}) {
    return `---
name: ${skill.slug}
description: ${skill.tagline}${skill.triggers.length > 0 ? `\ntriggers: ${skill.triggers.join(", ")}` : ""}
---

${skill.instructions}`;
}

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
        <div className="grid gap-6 lg:grid-cols-2">
            {skills.map((skill) => {
                const config = CATEGORY_CONFIG[skill.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.coding;
                const Icon = config.icon;
                const skillMdContent = generateSkillMd(skill);

                return (
                    <div
                        key={skill.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                    >
                        {/* Header */}
                        <div className="p-5 pb-3 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                                        {skill.name}
                                    </h3>
                                    {skill.featured && (
                                        <Sparkles className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {skill.tagline}
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
                                {skill.provider === "official" && (
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        Official
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* SKILL.md Preview */}
                        <div className="mx-5 mb-3 relative">
                            <div className="rounded-xl bg-muted/30 border border-border overflow-hidden">
                                <div className="px-3 py-2 border-b border-border bg-muted/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            .claude/skills/{skill.slug}/SKILL.md
                                        </span>
                                    </div>
                                    <CopyButton
                                        text={skillMdContent}
                                        label="SKILL.md copied!"
                                        className="opacity-0 group-hover:opacity-100 p-1.5 h-auto"
                                    />
                                </div>
                                <pre className="p-4 text-sm font-mono text-muted-foreground overflow-hidden max-h-36">
                                    <code className="line-clamp-6">
                                        {skillMdContent.slice(0, 400)}
                                        {skillMdContent.length > 400 && "..."}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        {/* Platforms */}
                        <div className="mx-5 mb-3 flex flex-wrap gap-1.5">
                            {skill.platforms.slice(0, 5).map((platform: string) => (
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
                            {skill.platforms.length > 5 && (
                                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    +{skill.platforms.length - 5}
                                </span>
                            )}
                        </div>

                        {/* Triggers */}
                        {skill.triggers.length > 0 && (
                            <div className="mx-5 mb-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-xs font-medium text-primary mb-1">When to use</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {skill.triggers.slice(0, 4).join(", ")}
                                    {skill.triggers.length > 4 && `, +${skill.triggers.length - 4} more`}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto px-5 py-3 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                    {skill.useCount.toLocaleString()} uses
                                </span>
                                {skill.authorName && (
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                                            {skill.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        {skill.authorName}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {skill.repoUrl && (
                                    <a
                                        href={skill.repoUrl}
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

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
    const params = await searchParams;

    // Get skill count
    const skillCount = await prisma.skill.count();

    return (
        <div className="dark min-h-screen bg-background">
            <div className="container py-10 space-y-10">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Wand2 className="h-4 w-4" />
                        Agent Skills
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Claude Code Agent Skills
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Copy-paste ready SKILL.md files for Claude Code, Cursor, Codex CLI, and more.
                        Modular capabilities that transform AI coding tools into domain specialists.
                    </p>

                    {/* Install Path Hint */}
                    <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                        <Terminal className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="text-sm">
                            <span className="text-muted-foreground">Install path: </span>
                            <code className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">
                                ~/.claude/skills/&lt;name&gt;/SKILL.md
                            </code>
                        </div>
                    </div>

                    <a
                        href="https://docs.anthropic.com/en/docs/claude-code/skills"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
                    >
                        Learn about Agent Skills <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-foreground">{skillCount}</span> skills available
                </div>

                {/* Filters */}
                <CategoryFilter currentCategory={params.category} />

                {/* Skills Grid */}
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
                    <SkillsList searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}
