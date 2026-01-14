import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Code2, FileText, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Platforms",
    description: "Explore AI coding platforms and their workflows",
};

const platformIcons: Record<string, typeof Code2> = {
    cursor: Code2,
    "claude-code": FileText,
    ramp: Zap,
    ralph: Code2,
    "replit-ai": Code2,
};

export default async function ProfilesPage() {
    const profiles = await prisma.platformProfile.findMany({
        orderBy: { name: "asc" },
    });

    // If no profiles in DB yet, show placeholder
    if (profiles.length === 0) {
        return (
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
                    <p className="mt-2 text-muted-foreground">
                        Explore AI coding platforms and their workflows
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { id: "cursor", name: "Cursor", tagline: "The AI-first code editor" },
                        { id: "claude-code", name: "Claude Code", tagline: "AI pair programming in your terminal" },
                        { id: "replit-ai", name: "Replit AI", tagline: "AI-powered development in the browser" },
                        { id: "github-copilot", name: "GitHub Copilot", tagline: "Your AI pair programmer" },
                        { id: "ramp", name: "Ramp", tagline: "AI coding assistant" },
                    ].map((platform) => {
                        const Icon = platformIcons[platform.id] || Code2;
                        return (
                            <div
                                key={platform.id}
                                className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">{platform.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {platform.tagline}
                                </p>
                                <p className="mt-4 text-xs text-muted-foreground">
                                    Coming soon...
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
                <p className="mt-2 text-muted-foreground">
                    Explore AI coding platforms and their workflows
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile) => {
                    const Icon = platformIcons[profile.platformId] || Code2;
                    return (
                        <Link
                            key={profile.id}
                            href={`/profiles/${profile.platformId}`}
                            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                {profile.name}
                            </h3>
                            {profile.tagline && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {profile.tagline}
                                </p>
                            )}
                            <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                View Guide <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
