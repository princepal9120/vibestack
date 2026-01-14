"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Upload, Plus, X } from "lucide-react";

const CATEGORIES = [
    { value: "web-app", label: "Web App" },
    { value: "cli", label: "CLI Tool" },
    { value: "mobile", label: "Mobile" },
    { value: "data", label: "Data" },
    { value: "ml", label: "ML/AI" },
    { value: "library", label: "Library" },
    { value: "automation", label: "Automation" },
    { value: "game", label: "Game" },
    { value: "other", label: "Other" },
];

const PLATFORMS = [
    "cursor",
    "claude-code",
    "ramp",
    "ralph",
    "replit-ai",
    "github-copilot",
    "other",
];

const TECH_STACK = [
    "react",
    "next.js",
    "typescript",
    "javascript",
    "python",
    "node.js",
    "tailwind",
    "prisma",
    "postgresql",
    "mongodb",
    "redis",
    "graphql",
    "rest",
    "docker",
    "vercel",
    "aws",
];

interface ProjectFormProps {
    initialData?: {
        title: string;
        description: string;
        longDescription?: string;
        category: string;
        platforms: string[];
        techStack: string[];
        githubUrl?: string;
        liveUrl?: string;
        keyInsights?: string;
    };
    projectId?: string;
}

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        longDescription: initialData?.longDescription || "",
        category: initialData?.category || "",
        platforms: initialData?.platforms || [],
        techStack: initialData?.techStack || [],
        githubUrl: initialData?.githubUrl || "",
        liveUrl: initialData?.liveUrl || "",
        keyInsights: initialData?.keyInsights || "",
    });

    const toggleArrayItem = (field: "platforms" | "techStack", item: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter((i) => i !== item)
                : [...prev[field], item],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
            const method = projectId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            router.push(`/projects/${data.data.id}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Project Title *
                </label>
                <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="My Awesome AI Project"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Short Description *
                </label>
                <textarea
                    id="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="A brief description of your project..."
                />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.value })}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                                formData.category === cat.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Platforms */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Platforms Used *</label>
                <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((platform) => (
                        <button
                            key={platform}
                            type="button"
                            onClick={() => toggleArrayItem("platforms", platform)}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                                formData.platforms.includes(platform)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border"
                            )}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Tech Stack *</label>
                <div className="flex flex-wrap gap-2">
                    {TECH_STACK.map((tech) => (
                        <button
                            key={tech}
                            type="button"
                            onClick={() => toggleArrayItem("techStack", tech)}
                            className={cn(
                                "rounded-full px-3 py-1 text-sm border transition-colors",
                                formData.techStack.includes(tech)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border"
                            )}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            {/* URLs */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="githubUrl" className="text-sm font-medium">
                        GitHub URL
                    </label>
                    <input
                        id="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, githubUrl: e.target.value })
                        }
                        className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://github.com/..."
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="liveUrl" className="text-sm font-medium">
                        Live Demo URL
                    </label>
                    <input
                        id="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) =>
                            setFormData({ ...formData, liveUrl: e.target.value })
                        }
                        className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://myproject.com"
                    />
                </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
                <label htmlFor="keyInsights" className="text-sm font-medium">
                    Key Insights (Markdown)
                </label>
                <textarea
                    id="keyInsights"
                    rows={6}
                    value={formData.keyInsights}
                    onChange={(e) =>
                        setFormData({ ...formData, keyInsights: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-none"
                    placeholder="Share how you used AI tools to build this project..."
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className={cn(
                    "w-full inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {projectId ? "Updating..." : "Publishing..."}
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        {projectId ? "Update Project" : "Publish Project"}
                    </>
                )}
            </button>
        </form>
    );
}
