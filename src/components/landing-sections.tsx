"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Sparkles,
    Code2,
    Users,
    Rocket,
    Zap,
    BookOpen,
    Layers,
    ExternalLink,
    ThumbsUp,
    MessageCircle,
} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Learn AI Coding",
        description:
            "Access industry-grade setup guides and workflows for Cursor, Claude Code, and more.",
    },
    {
        icon: Layers,
        title: "Discover Projects",
        description:
            "Browse real-world projects built with AI tools. Get inspired by what's possible.",
    },
    {
        icon: Users,
        title: "Join the Community",
        description:
            "Share your projects, get feedback, and connect with other AI-assisted developers.",
    },
    {
        icon: Zap,
        title: "Level Up Fast",
        description:
            "Learn proven patterns and prompts that make you productive from day one.",
    },
];

const stats = [
    { value: "500+", label: "Projects" },
    { value: "5", label: "Platforms" },
    { value: "10k+", label: "Developers" },
    { value: "50k+", label: "Views" },
];

// Fade up animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
            {/* Gradient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 -z-10 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Badge */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">The community for AI-assisted coding</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
                The amazing things people are building with{" "}
                <span className="text-primary">AI</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
                A curated showcase of impressive projects, workflows, and content from the AI coding community.
            </motion.p>

            {/* CTAs */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
                <Link
                    href="/projects"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg glow-primary transition-all hover:opacity-90"
                >
                    Explore Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                    href="/projects/new"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                    Submit Project
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                        className="text-center"
                    >
                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export function FeaturesSection() {
    return (
        <section className="border-t border-border bg-muted/30 py-24">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to vibe code
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From learning the basics to showcasing your projects, we've got you
                        covered.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/50"
                        >
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Featured Projects Component - receives data from server component
interface FeaturedProject {
    id: string;
    title: string;
    description: string;
    category: string;
    platforms: string[];
    screenshots: string[];
    upvoteCount: number;
    commentCount: number;
    author: {
        username: string;
        avatar: string | null;
    };
}

export function FeaturedProjectsSection({ projects }: { projects: FeaturedProject[] }) {
    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <section className="py-24">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
                        <p className="mt-2 text-muted-foreground">
                            Discover what the community is building
                        </p>
                    </div>
                    <Link
                        href="/projects"
                        className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        View all projects
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {projects.slice(0, 6).map((project, i) => (
                        <motion.div
                            key={project.id}
                            variants={fadeUp}
                            className="group"
                        >
                            <Link
                                href={`/projects/${project.id}`}
                                className="block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    {project.screenshots[0] ? (
                                        <Image
                                            src={project.screenshots[0]}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Code2 className="h-12 w-12 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Category badge */}
                                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                                        {project.category.replace("-", " ")}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-muted overflow-hidden">
                                                {project.author.avatar && (
                                                    <Image
                                                        src={project.author.avatar}
                                                        alt={project.author.username}
                                                        width={24}
                                                        height={24}
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {project.author.username}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="h-3.5 w-3.5" />
                                                {project.upvoteCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="h-3.5 w-3.5" />
                                                {project.commentCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mt-8 text-center sm:hidden"
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        View all projects
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

// Brand Icons
const CursorIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M80.9602 240.235L22.95 24.225C21.6 20.325 25.5 16.5 29.325 17.85L237.15 89.2501C241.275 90.6751 241.275 96.5251 237.15 97.9501L156.45 125.7L213.3 182.55C217.5 186.75 217.5 193.575 213.3 197.775L197.7 213.375C193.5 217.575 186.675 217.575 182.475 213.375L125.625 156.525L98.5502 240.225C96.9752 244.575 90.8252 244.425 80.9602 240.235Z" />
    </svg>
);

const ClaudeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M14.625 2.25c-4.493 0-8.914 1.583-12.039 4.312C2.185 6.91 2.015 7.152 2.128 7.394c.112.242.368.375.632.33 2.502-.43 5.483.5 7.73 2.454a8.97 8.97 0 0 1 3.036 5.378c.094.468.56.772 1.036.677.476-.095.78-.56.686-1.028a10.47 10.47 0 0 0-3.543-6.275c-1.87-1.626-4.223-2.585-6.524-2.657 2.768-2.317 6.586-3.648 10.518-3.648 4.697 0 8.922 2.115 11.758 5.462.2.236.55.267.79.068.238-.198.27-.55.07-.786C25.467 3.654 20.669 1.125 15.375 1.125c-.25 0-.5.006-.75.018zM6.92 11.23c-.158.266-.07.608.196.766 2.062 1.22 3.513 3.328 3.829 5.728.04.305.32.518.625.477.306-.04.52-.32.48-.625-.365-2.775-2.043-5.212-4.427-6.623-.267-.158-.609-.07-.767.197zM2.87 15.02c-.282.128-.407.46-.279.742 1.14 2.507 3.31 4.398 5.922 5.163.298.087.607-.086.695-.384.087-.298-.086-.607-.384-.694-2.26-.662-4.137-2.298-5.123-4.467-.128-.282-.46-.407-.741-.278z" />
    </svg>
);

const CopilotIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47 2 2 6.47 2 12c0 5.53 4.47 10 10 10s10-4.47 10-10c0-5.53-4.47-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
        {/* Using a generic check/code style icon as placeholder for Copilot if specific path unavailable, but actually let's use the GitHub Octocat simplified for better recognition */}
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const ReplitIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM7 6H11V10H7V6ZM13 6H17V10H13V6ZM7 14H11V18H7V14Z" />
    </svg>
);

const WindsurfIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z" />
        {/* Placeholder for Windsurf - simple geometric sail shape */}
    </svg>
);

export function PlatformsSection() {
    const platforms = [
        { id: "cursor", name: "Cursor", icon: CursorIcon },
        { id: "claude-code", name: "Claude Code", icon: ClaudeIcon },
        { id: "gemini-cli", name: "Gemini CLI", icon: ClaudeIcon }, // Using similar icon
        { id: "github-copilot", name: "GitHub Copilot", icon: CopilotIcon },
        { id: "opencode", name: "OpenCode", icon: ReplitIcon }, // Using similar icon
        { id: "ralph", name: "Ralph", icon: WindsurfIcon }, // Using similar icon
        { id: "replit-ai", name: "Replit AI", icon: ReplitIcon },
        { id: "windsurf", name: "Windsurf", icon: WindsurfIcon },
    ];

    return (
        <section className="border-t border-border py-24 bg-muted/20">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tight">Explore by Platform</h2>
                    <p className="mt-4 text-muted-foreground">
                        Learn workflows and discover projects for your favorite AI coding tools
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="flex flex-wrap justify-center gap-4"
                >
                    {platforms.map((platform) => (
                        <motion.div key={platform.id} variants={fadeUp}>
                            <Link
                                href={`/profiles/${platform.id}`}
                                className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group"
                            >
                                <platform.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                                {platform.name}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section className="border-t border-border py-24">
            <div className="container">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 px-8 py-16 text-center md:px-16">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="relative"
                    >
                        <Rocket className="mx-auto mb-6 h-12 w-12 text-primary" />
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to share your project?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                            Join the community and showcase what you've built with AI coding
                            tools. Get feedback, inspire others, and build your portfolio.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/projects/new"
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg glow-primary transition-all hover:opacity-90"
                            >
                                Submit Your Project
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Resources & Learning Section
export function ResourcesSection() {
    const sections = [
        {
            title: "Workflows & Rules",
            description: "Best practices, hacks, and .cursorrules setup guides",
            href: "/workflows",
            icon: "⚡",
            color: "from-blue-500/20 to-blue-500/5",
        },
        {
            title: "Prompts & Skills",
            description: "Claude skills and prompt templates for any task",
            href: "/prompts",
            icon: "💬",
            color: "from-purple-500/20 to-purple-500/5",
        },
        {
            title: "Resources",
            description: "Curated blogs, X posts, and YouTube videos",
            href: "/resources",
            icon: "📚",
            color: "from-green-500/20 to-green-500/5",
        },
        {
            title: "End-to-End Guides",
            description: "Complete journeys from idea to shipped product",
            href: "/guides",
            icon: "🚀",
            color: "from-orange-500/20 to-orange-500/5",
        },
    ];

    return (
        <section className="border-t border-border py-24">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tight">Learn & Level Up</h2>
                    <p className="mt-4 text-muted-foreground">
                        Everything you need to master AI-assisted coding
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                    {sections.map((section) => (
                        <motion.div key={section.href} variants={fadeUp}>
                            <Link
                                href={section.href}
                                className={cn(
                                    "group block rounded-xl border border-border bg-gradient-to-br p-6 transition-all hover:shadow-lg hover:border-primary/30",
                                    section.color
                                )}
                            >
                                <span className="text-3xl mb-4 block">{section.icon}</span>
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {section.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {section.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

