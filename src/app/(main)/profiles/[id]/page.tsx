import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { getPlatformIcon } from "@/components/icons";

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

    const Icon = getPlatformIcon(profile.platformId);

    return (
        <div className="container max-w-4xl py-8">
            {/* Header */}
            <div className="mb-8 flex items-start gap-6">
                <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-10 w-10" />
                </div>
                <div>
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
            </div>


            {/* Description */}
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
                <p className="text-lg leading-relaxed">{profile.description}</p>
            </div>

            {/* Cheat Sheet */}
            {profile.cheatSheet.length > 0 && (
                <div className="mb-12">
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
            <div>
                <h2 className="text-2xl font-bold mb-6">Setup Guide</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap rounded-lg border bg-muted/50 p-6">
                        {profile.setupGuide}
                    </div>
                </div>
            </div>
        </div>
    );
}
