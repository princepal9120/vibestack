"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    FileText,
    Youtube,
    Twitter,
    CheckCircle2,
    ArrowRight,
    Loader2,
    ExternalLink,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RESOURCE_TYPES = [
    {
        value: "blog",
        label: "Blog Post",
        icon: BookOpen,
        description: "Articles, guides, and written content",
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
        value: "tutorial",
        label: "Tutorial",
        icon: FileText,
        description: "Step-by-step learning content",
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
        value: "youtube",
        label: "YouTube Video",
        icon: Youtube,
        description: "Video tutorials and demos",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    {
        value: "social",
        label: "Social Post",
        icon: Twitter,
        description: "X/Twitter threads and posts",
        color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    },
];

export default function SubmitResourcePage() {
    const [step, setStep] = useState<"type" | "details" | "success">("type");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: "",
        authorName: "",
        authorEmail: "",
        platforms: [] as string[],
    });

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setStep("details");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/resources/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    type: selectedType,
                }),
            });

            if (response.ok) {
                setStep("success");
            }
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const platforms = ["Cursor", "Claude Code", "GitHub Copilot", "Windsurf", "Replit AI"];

    // Success State
    if (step === "success") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold">Resource Submitted!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your contribution. Our team will review your submission and it will appear on the site once approved.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/resources"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                        >
                            Browse Resources
                        </Link>
                        <button
                            onClick={() => {
                                setStep("type");
                                setSelectedType(null);
                                setFormData({
                                    title: "",
                                    url: "",
                                    description: "",
                                    authorName: "",
                                    authorEmail: "",
                                    platforms: [],
                                });
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
                        >
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-2xl py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Sparkles className="h-4 w-4" />
                        Submit Resource
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Share a Resource
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Contribute to the community by sharing blogs, tutorials, videos, or social posts about AI coding.
                    </p>
                </div>

                {/* Step 1: Select Type */}
                {step === "type" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4">What type of resource are you submitting?</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {RESOURCE_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleTypeSelect(type.value)}
                                    className={cn(
                                        "group relative flex flex-col items-start gap-3 rounded-2xl border-2 border-border p-5 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5",
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-xl border",
                                        type.color
                                    )}>
                                        <type.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                                            {type.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {type.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="absolute top-5 right-5 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Details Form */}
                {step === "details" && selectedType && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Back button */}
                        <button
                            type="button"
                            onClick={() => setStep("type")}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to type selection
                        </button>

                        {/* Type indicator */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                            {(() => {
                                const type = RESOURCE_TYPES.find(t => t.value === selectedType)!;
                                return (
                                    <>
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg border",
                                            type.color
                                        )}>
                                            <type.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{type.label}</p>
                                            <p className="text-xs text-muted-foreground">{type.description}</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                URL <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="url"
                                    required
                                    placeholder="https://..."
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Give your resource a descriptive title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="What will people learn from this resource?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>

                        {/* Platforms */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Related Platforms
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {platforms.map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        onClick={() => {
                                            if (formData.platforms.includes(platform)) {
                                                setFormData({
                                                    ...formData,
                                                    platforms: formData.platforms.filter(p => p !== platform),
                                                });
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    platforms: [...formData.platforms, platform],
                                                });
                                            }
                                        }}
                                        className={cn(
                                            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                                            formData.platforms.includes(platform)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-accent"
                                        )}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submitter Info */}
                        <div className="pt-4 border-t border-border space-y-4">
                            <h3 className="text-sm font-medium">Your Information (optional)</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.authorName}
                                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <input
                                    type="email"
                                    placeholder="Email (for updates)"
                                    value={formData.authorEmail}
                                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Resource
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-muted-foreground">
                            Resources are reviewed before appearing on the site. This usually takes 1-2 days.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
