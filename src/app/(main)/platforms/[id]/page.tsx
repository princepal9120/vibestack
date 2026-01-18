import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
    ExternalLink,
    CheckCircle2,
    Folder,
    Server,
    Lightbulb,
    Copy,
    Terminal,
    BookOpen,
    Zap
} from "lucide-react";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: ProfilePageProps): Promise<Metadata> {
    const { id } = await params;
    const profile = await prisma.platformProfile.findFirst({
        where: { OR: [{ id }, { platformId: id }] },
        select: { name: true, description: true },
    });

    if (!profile) return { title: "Platform Not Found" };

    return {
        title: `${profile.name} Guide`,
        description: profile.description.slice(0, 160),
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    const profile = await prisma.platformProfile.findFirst({
        where: { OR: [{ id }, { platformId: id }] },
    });

    if (!profile) {
        notFound();
    }

    return (
        <div className="container max-w-5xl py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
                {profile.tagline && (
                    <p className="mt-2 text-xl text-muted-foreground">{profile.tagline}</p>
                )}
                {profile.websiteUrl && (
                    <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                        Visit Website <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>

            {/* Description */}
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
                <p className="text-lg leading-relaxed">{profile.description}</p>
            </div>

            {/* Skills Path Card - If available */}
            {profile.skillsPath && (
                <div className="mb-8 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                            <Folder className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">Skills Directory</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Place your skills in this directory structure:
                            </p>
                            <div className="flex items-center gap-2 bg-background/80 rounded-lg px-4 py-3 border font-mono text-sm">
                                <Terminal className="h-4 w-4 text-muted-foreground" />
                                <code className="flex-1">{profile.skillsPath}</code>
                                <button
                                    className="p-1 hover:bg-muted rounded transition-colors"
                                    title="Copy path"
                                >
                                    <Copy className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Skills Guide */}
                {profile.skillsGuide && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Skills Guide</h2>
                        </div>
                        <div className="p-6">
                            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto">
                                    {profile.skillsGuide}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* MCP Guide */}
                {profile.mcpGuide && (
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
                            <Server className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">MCP Setup</h2>
                            {profile.mcpSupported ? (
                                <span className="ml-auto text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                                    Supported
                                </span>
                            ) : (
                                <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                    Not Available
                                </span>
                            )}
                        </div>
                        <div className="p-6">
                            {profile.mcpConfigPath && (
                                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium">Config:</span>
                                    <code className="bg-muted px-2 py-0.5 rounded text-xs">
                                        {profile.mcpConfigPath}
                                    </code>
                                </div>
                            )}
                            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm bg-muted/50 rounded-lg p-4 overflow-x-auto">
                                    {profile.mcpGuide}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Best Practices */}
            {profile.bestPractices && profile.bestPractices.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Best Practices</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {profile.bestPractices.map((practice, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors"
                            >
                                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{practice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cheat Sheet */}
            {profile.cheatSheet.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Quick Reference</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {profile.cheatSheet.map((tip, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-lg border bg-card p-4"
                            >
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Setup Guide */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Setup Guide</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-6 text-sm">
                        {profile.setupGuide}
                    </div>
                </div>
            </div>
        </div>
    );
}
