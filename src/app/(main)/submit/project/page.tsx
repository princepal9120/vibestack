"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
    ArrowRight,
    Loader2,
    Upload,
    Link as LinkIcon,
    Github,
    Globe,
    Image as ImageIcon,
    Sparkles,
    X,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS = [
    "Cursor",
    "Claude Code",
    "GitHub Copilot",
    "Windsurf",
    "Replit AI",
    "Gemini CLI",
    "Ralph",
    "OpenCode",
];

const TECH_STACK = [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Node.js",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL",
    "MongoDB",
    "FastAPI",
    "Django",
    "Go",
    "Rust",
];

export default function SubmitProjectPage() {
    const router = useRouter();
    const { user, isLoaded, isSignedIn } = useUser();
    const [step, setStep] = useState<"details" | "media" | "preview" | "success">("details");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        tagline: "",
        description: "",
        demoUrl: "",
        repoUrl: "",
        platforms: [] as string[],
        techStack: [] as string[],
        thumbnail: null as File | null,
        thumbnailPreview: "",
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
                        Create an account or sign in to share your AI-built project with the community.
                    </p>
                    <button
                        onClick={() => router.push("/sign-in?redirect_url=/submit/project")}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
                    >
                        Sign In to Continue
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({
                ...formData,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file),
            });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("tagline", formData.tagline);
            submitData.append("description", formData.description);
            submitData.append("demoUrl", formData.demoUrl);
            submitData.append("repoUrl", formData.repoUrl);
            submitData.append("platforms", JSON.stringify(formData.platforms));
            submitData.append("techStack", JSON.stringify(formData.techStack));
            if (formData.thumbnail) {
                submitData.append("thumbnail", formData.thumbnail);
            }

            const response = await fetch("/api/projects", {
                method: "POST",
                body: submitData,
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

    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item)
            ? array.filter(i => i !== item)
            : [...array, item];
    };

    // Success State
    if (step === "success") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold">🎉 Project Launched!</h1>
                    <p className="text-muted-foreground">
                        Your project is now live on Vibe Stack. Share it with the world and get feedback from the community!
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => router.push("/projects")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground"
                        >
                            View All Projects
                        </button>
                        <button
                            onClick={() => {
                                setStep("details");
                                setFormData({
                                    title: "",
                                    tagline: "",
                                    description: "",
                                    demoUrl: "",
                                    repoUrl: "",
                                    platforms: [],
                                    techStack: [],
                                    thumbnail: null,
                                    thumbnailPreview: "",
                                });
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 text-base font-medium hover:bg-accent"
                        >
                            Submit Another Project
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-3xl py-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                        <Sparkles className="h-4 w-4" />
                        Launch Your Project
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Submit Your AI-Built Project
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Share what you've built with AI coding tools and get discovered by the community
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-10">
                    {[
                        { id: "details", label: "Details" },
                        { id: "media", label: "Media" },
                        { id: "preview", label: "Preview" },
                    ].map((s, index) => (
                        <div key={s.id} className="flex items-center gap-3">
                            <button
                                onClick={() => setStep(s.id as any)}
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                                    step === s.id || ["details", "media", "preview"].indexOf(step) > index
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {index + 1}
                            </button>
                            <span className={cn(
                                "text-sm font-medium",
                                step === s.id ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {s.label}
                            </span>
                            {index < 2 && (
                                <div className={cn(
                                    "w-12 h-0.5",
                                    ["details", "media", "preview"].indexOf(step) > index
                                        ? "bg-primary"
                                        : "bg-border"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Details */}
                {step === "details" && (
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., AI Dashboard Builder"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-lg font-medium placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tagline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="A short, catchy description (max 100 chars)"
                                maxLength={100}
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {formData.tagline.length}/100
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows={5}
                                placeholder="Tell us about your project. What problem does it solve? How did AI help you build it?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>

                        {/* Links */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Demo URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="url"
                                        placeholder="https://your-demo.com"
                                        value={formData.demoUrl}
                                        onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GitHub URL</label>
                                <div className="relative">
                                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        value={formData.repoUrl}
                                        onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Platforms */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">
                                AI Tools Used <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            platforms: toggleArrayItem(formData.platforms, platform),
                                        })}
                                        className={cn(
                                            "rounded-full px-4 py-2 text-sm font-medium border transition-all",
                                            formData.platforms.includes(platform)
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card border-border text-muted-foreground hover:border-primary/50"
                                        )}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Tech Stack</label>
                            <div className="flex flex-wrap gap-2">
                                {TECH_STACK.map((tech) => (
                                    <button
                                        key={tech}
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            techStack: toggleArrayItem(formData.techStack, tech),
                                        })}
                                        className={cn(
                                            "rounded-full px-3 py-1.5 text-sm font-medium border transition-all",
                                            formData.techStack.includes(tech)
                                                ? "bg-primary/10 text-primary border-primary/30"
                                                : "bg-muted border-transparent text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => setStep("media")}
                            disabled={!formData.title || !formData.tagline || !formData.description || formData.platforms.length === 0}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Continue to Media
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Step 2: Media */}
                {step === "media" && (
                    <div className="space-y-6">
                        <button
                            onClick={() => setStep("details")}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to details
                        </button>

                        {/* Thumbnail Upload */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">
                                Project Thumbnail
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Upload a screenshot or cover image (1200x630 recommended)
                            </p>

                            {formData.thumbnailPreview ? (
                                <div className="relative rounded-2xl overflow-hidden border border-border">
                                    <Image
                                        src={formData.thumbnailPreview}
                                        alt="Thumbnail preview"
                                        width={1200}
                                        height={630}
                                        className="w-full aspect-video object-cover"
                                    />
                                    <button
                                        onClick={() => setFormData({
                                            ...formData,
                                            thumbnail: null,
                                            thumbnailPreview: "",
                                        })}
                                        className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 backdrop-blur hover:bg-background"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border p-12 cursor-pointer hover:border-primary/50 transition-colors">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium">Click to upload</p>
                                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <button
                            onClick={() => setStep("preview")}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                        >
                            Preview & Launch
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Step 3: Preview */}
                {step === "preview" && (
                    <div className="space-y-6">
                        <button
                            onClick={() => setStep("media")}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to media
                        </button>

                        <div className="rounded-2xl border border-border overflow-hidden">
                            {/* Preview Card */}
                            {formData.thumbnailPreview && (
                                <Image
                                    src={formData.thumbnailPreview}
                                    alt="Thumbnail"
                                    width={1200}
                                    height={630}
                                    className="w-full aspect-video object-cover"
                                />
                            )}
                            <div className="p-6 space-y-4">
                                <h2 className="text-2xl font-bold">{formData.title}</h2>
                                <p className="text-muted-foreground">{formData.tagline}</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.platforms.map((p) => (
                                        <span key={p} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                            {p}
                                        </span>
                                    ))}
                                    {formData.techStack.map((t) => (
                                        <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm whitespace-pre-wrap">{formData.description}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Launching...
                                </>
                            ) : (
                                <>
                                    🚀 Launch Project
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
