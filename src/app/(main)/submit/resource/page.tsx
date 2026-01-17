"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TweetCard } from "@/components/tweet-card";

const RESOURCE_TYPES = [
    {
        value: "social",
        label: "Social Post",
        icon: Twitter,
        description: "X/Twitter threads & Reddit discussions",
        color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
        placeholder: "https://x.com/... or https://reddit.com/r/...",
    },
    {
        value: "youtube",
        label: "YouTube Video",
        icon: Youtube,
        description: "Video tutorials, demos & deep dives",
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        placeholder: "https://youtube.com/watch?v=...",
    },
    {
        value: "blog",
        label: "Article / Guide",
        icon: BookOpen,
        description: "Medium, Substack, Dev.to, or personal blogs",
        color: "bg-primary/10 text-primary border-primary/20",
        placeholder: "https://medium.com/...",
    },
];

interface Metadata {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    authorName?: string;
    authorHandle?: string;
    type: "youtube" | "twitter" | "article";
}

export default function SubmitResourcePage() {
    const router = useRouter();
    const { user, isLoaded, isSignedIn } = useUser();
    const [step, setStep] = useState<"type" | "details" | "success">("type");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: "",
        authorName: "",
        authorHandle: "",
        thumbnailUrl: "",
    });

    // Redirect to sign-in if not authenticated
    if (isLoaded && !isSignedIn) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Sign in to Submit</h1>
                    <p className="text-muted-foreground">
                        Create an account or sign in to share a resource with the community.
                    </p>
                    <button
                        onClick={() => router.push("/sign-in?redirect_url=/submit/resource")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
                    >
                        Sign In to Continue
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setStep("details");
        setMetadata(null);
        setMetadataError(null);
        setFormData({
            title: "",
            url: "",
            description: "",
            authorName: "",
            authorHandle: "",
            thumbnailUrl: "",
        });
    };

    // Debounced URL metadata fetching
    const fetchMetadata = useCallback(async (url: string) => {
        if (!url || url.length < 10) return;

        try {
            new URL(url); // Validate URL
        } catch {
            return;
        }

        setIsFetchingMetadata(true);
        setMetadataError(null);

        try {
            const response = await fetch(`/api/resources/metadata?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                const error = await response.json();
                setMetadataError(error.error || "Could not fetch metadata");
                setMetadata(null);
                return;
            }

            const data: Metadata = await response.json();
            setMetadata(data);

            // Auto-fill form with fetched data
            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                description: data.description || prev.description,
                authorName: data.authorName || prev.authorName,
                authorHandle: data.authorHandle || prev.authorHandle,
                thumbnailUrl: data.thumbnailUrl || prev.thumbnailUrl,
            }));
        } catch {
            setMetadataError("Failed to fetch metadata");
            setMetadata(null);
        } finally {
            setIsFetchingMetadata(false);
        }
    }, []);

    // Debounce URL changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.url) {
                fetchMetadata(formData.url);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.url, fetchMetadata]);

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

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("✓ Resource submitted!", {
                    description: "Your content is now live on Vibe Stack",
                });
                router.push("/resources");
            } else if (response.status === 409) {
                toast.error("Already submitted", {
                    description: "This resource has already been added to Vibe Stack",
                });
            } else {
                toast.error("Submission failed", {
                    description: data.error || "Please try again",
                });
            }
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Something went wrong", {
                description: "Please check your connection and try again",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                setMetadata(null);
                                setFormData({
                                    title: "",
                                    url: "",
                                    description: "",
                                    authorName: "",
                                    authorHandle: "",
                                    thumbnailUrl: "",
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
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Submit Content
                    </h1>
                    <p className="text-muted-foreground">
                        Built something cool with Claude? Share it with the community.
                    </p>
                </div>

                {/* Step 1: Select Type */}
                {step === "type" && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium mb-4">What is it?</h2>
                        <div className="grid gap-3 grid-cols-3">
                            {RESOURCE_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => handleTypeSelect(type.value)}
                                    className={cn(
                                        "group relative flex flex-col items-center gap-2 rounded-xl border-2 border-border p-6 text-center transition-all hover:border-primary/50",
                                    )}
                                >
                                    <type.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                        {type.label}
                                    </span>
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
                            onClick={() => {
                                setStep("type");
                                setMetadata(null);
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back
                        </button>

                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Link <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    required
                                    placeholder={RESOURCE_TYPES.find(t => t.value === selectedType)?.placeholder || "https://..."}
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {isFetchingMetadata && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        {/* Social/Tweet Preview */}
                        {selectedType === "social" && (formData.description || formData.authorName) && (
                            <div className="space-y-2 mb-6">
                                <label className="text-sm font-medium">Preview</label>
                                <TweetCard
                                    author={{
                                        name: formData.authorName || "Author Name",
                                        handle: formData.authorHandle || "@handle",
                                        avatar: formData.thumbnailUrl || "https://github.com/shadcn.png",
                                    }}
                                    content={formData.description || "Tweet content will appear here..."}
                                />
                            </div>
                        )}

                        {/* Standard Metadata Preview (for non-social) */}
                        {selectedType !== "social" && metadata && metadata.thumbnailUrl && (
                            <div className="relative rounded-xl border border-border bg-card overflow-hidden">
                                <div className="aspect-video relative bg-muted">
                                    <Image
                                        src={metadata.thumbnailUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {selectedType === "youtube" && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-medium line-clamp-2">{metadata.title}</p>
                                    {metadata.authorName && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {metadata.authorName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Metadata Error */}
                        {metadataError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{metadataError}</span>
                                <button
                                    type="button"
                                    onClick={() => fetchMetadata(formData.url)}
                                    className="ml-auto hover:bg-destructive/20 p-1 rounded"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Title - only show for X posts or if no metadata */}
                        {(selectedType === "social" || !metadata?.title) && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    What&apos;s it about? <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Claude Code rewrote my entire codebase"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        )}

                        {/* Author Info for X posts */}
                        {selectedType === "social" && (
                            <div className="grid gap-4 grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Author name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Andrej Karpathy"
                                        value={formData.authorName}
                                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Handle <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="@karpathy"
                                        value={formData.authorHandle}
                                        onChange={(e) => setFormData({ ...formData, authorHandle: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Thumbnail URL for articles (optional - if auto-fetch failed) */}
                        {selectedType === "blog" && !metadata?.thumbnailUrl && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Thumbnail Image URL <span className="text-muted-foreground text-xs">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/og-image.png"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Paste the Open Graph image URL if automatic fetching didn&apos;t work. Try right-clicking the article&apos;s preview image and copying the image URL.
                                </p>
                                {formData.thumbnailUrl && (
                                    <div className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden mt-2">
                                        <Image
                                            src={formData.thumbnailUrl}
                                            alt="Thumbnail preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isFetchingMetadata}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-6 py-4 text-base font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
