import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRuleBySlug, getRelatedRules, rules } from "@/lib/content/rules";
import { CopyButton } from "@/components/subagents/copy-button";
import { DownloadButton } from "@/components/subagents/download-button";
import { ShareButton } from "@/components/subagents/share-button";
import { RuleCardSmall } from "@/components/subagents/rule-card-small";
import { ArrowLeft, Terminal, FileText } from "lucide-react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const rule = getRuleBySlug(slug);

    if (!rule) {
        return { title: "Not Found" };
    }

    return {
        title: `${rule.title} | Sub-Agents | Vibe Stack`,
        description: rule.description || `${rule.title} - Claude Code sub-agent prompt`,
    };
}

export async function generateStaticParams() {
    return rules.map((rule) => ({
        slug: rule.slug,
    }));
}

export default async function SubAgentDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const rule = getRuleBySlug(slug);

    if (!rule) {
        notFound();
    }

    const relatedRules = getRelatedRules(slug, 4);

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl py-12">
                {/* Back Link */}
                <Link
                    href="/collections/subagents"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sub-Agents
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{rule.title}</h1>
                            {rule.description && (
                                <p className="text-muted-foreground">{rule.description}</p>
                            )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <CopyButton content={rule.content} />
                            <DownloadButton content={rule.content} filename={rule.slug} />
                            <ShareButton slug={rule.slug} />
                        </div>
                    </div>

                    {/* Tools/Libs */}
                    {rule.libs && rule.libs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {rule.libs.map((lib) => (
                                <span
                                    key={lib}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm font-mono text-muted-foreground"
                                >
                                    <Terminal className="h-3 w-3" />
                                    {lib}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="rounded-xl border border-border bg-card p-6 mb-12">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">System Prompt</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                        {rule.content}
                    </pre>
                </div>

                {/* Related Rules */}
                {relatedRules.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-6">Related Sub-Agents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedRules.map((related) => (
                                <RuleCardSmall key={related.slug} rule={related} small />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
