"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
    ThumbsUp,
    MessageCircle,
    ChevronDown,
} from "lucide-react";
import {
    CursorIcon,
    ClaudeIcon,
    GeminiIcon,
    CopilotIcon,
    ReplitIcon,
    WindsurfIcon,
    OpenCodeIcon,
    RooCodeIcon,
} from "@/components/icons";
import { TweetCard } from "@/components/tweet-card";

const features = [
    {
        icon: BookOpen,
        title: "Platform Guides",
        description:
            "Comprehensive setup guides, workflows, and cheat sheets for Cursor, Claude Code, Gemini CLI, and more.",
    },
    {
        icon: Layers,
        title: "Project Showcase",
        description:
            "Browse and submit real-world projects built with AI coding tools. Get inspired by what developers are building.",
    },
    {
        icon: Code2,
        title: "Sub-Agents & Skills",
        description:
            "Discover role-specific AI prompts and modular skills to supercharge your development workflow.",
    },
    {
        icon: Zap,
        title: "MCP Servers",
        description:
            "Explore Model Context Protocol integrations to connect AI tools with your databases, APIs, and services.",
    },
    {
        icon: Users,
        title: "Open Source Community",
        description:
            "100% open source. Contribute resources, submit PRs, and help shape the future of AI-assisted coding.",
    },
    {
        icon: Rocket,
        title: "Resource Library",
        description:
            "Curated blogs, tutorials, YouTube videos, and X threads from the AI coding community.",
    },
];

const stats = [
    { value: "8+", label: "AI Platforms" },
    { value: "100+", label: "Resources" },
    { value: "Open", label: "Source" },
    { value: "MIT", label: "License" },
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
                <span className="text-muted-foreground">Open source community for AI-assisted coding</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
                Your hub for{" "}
                <span className="text-primary">AI coding</span>{" "}
                tools & community
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
                Discover platform guides, projects, sub-agents, skills, and resources for Cursor, Claude Code, Gemini CLI, and more. 100% open source.
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
                        Everything you need for AI-assisted coding
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From learning your first AI tool to showcasing production projects—we&apos;ve got you covered.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
                    {projects.slice(0, 3).map((project) => (
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

export function PlatformsSection() {
    const platforms = [
        { id: "cursor", name: "Cursor", icon: CursorIcon },
        { id: "claude-code", name: "Claude Code", icon: ClaudeIcon },
        { id: "gemini-cli", name: "Gemini CLI", icon: GeminiIcon },
        { id: "github-copilot", name: "GitHub Copilot", icon: CopilotIcon },
        { id: "opencode", name: "OpenCode", icon: OpenCodeIcon },
        { id: "roo-code", name: "Roo Code", icon: RooCodeIcon },
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
                            Contribute to VibeStack
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                            VibeStack is 100% open source. Submit your projects, contribute resources, or help improve the platform. Every contribution matters.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/projects/new"
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg glow-primary transition-all hover:opacity-90"
                            >
                                Submit Project
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="https://github.com/princepal9120/vibestack"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                            >
                                Star on GitHub
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

const faqs = [
    {
        question: "What is VibeStack?",
        answer: "VibeStack is an open-source community platform for AI-assisted coding. We curate platform guides, projects, sub-agents, skills, MCP servers, and resources to help developers build faster with tools like Cursor, Claude Code, Gemini CLI, and more."
    },
    {
        question: "Is VibeStack open source?",
        answer: "Yes! VibeStack is 100% open source under the MIT license. You can view the code, submit pull requests, report issues, and contribute to the project on GitHub at github.com/princepal9120/vibestack."
    },
    {
        question: "What's the difference between sub-agents and skills?",
        answer: "Sub-agents are specialized AI personas with detailed system prompts for handling complex tasks (like a 'React Architect' or 'Python Expert'). Skills are modular capabilities—specific instructions that enhance what an AI can do (like reading files, generating docs, or running commands)."
    },
    {
        question: "What is an MCP Server?",
        answer: "MCP (Model Context Protocol) is a standard that lets AI tools connect to external services—databases, APIs, design tools, and more. MCP servers give your AI the ability to interact with real-world systems securely and extend its capabilities."
    },
    {
        question: "How can I contribute?",
        answer: "There are many ways to contribute: submit your AI-built projects, share useful resources (blogs, videos, tutorials), add sub-agents or skills, or contribute to the codebase directly. Check our CONTRIBUTING.md on GitHub for detailed guidelines."
    },
    {
        question: "Which AI coding platforms are supported?",
        answer: "We support 8+ platforms including Cursor, Claude Code, Gemini CLI, GitHub Copilot, OpenCode, Roo Code, Replit AI, and Windsurf. Many resources and prompts are adaptable across different AI tools."
    }
];

export function FAQSection() {
    return (
        <section className="border-t border-border bg-muted/10 py-24">
            <div className="container max-w-3xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Common questions about Vibe Stack and AI coding tools.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50"
            >
                <span className="text-lg font-medium">{question}</span>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 pt-0 text-muted-foreground border-t border-border/50 bg-muted/20">
                            <div className="pt-4">{answer}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const testimonials = [
    {
        author: {
            name: "Prajwal Tomar",
            handle: "@PrajwalTomar_",
            avatar: "https://github.com/shadcn.png" // Placeholder or verify if valid
        },
        content: "Stop saying AI can't design. Cursor + Opus 4.5 just helped me build a landing page with scrollytelling animations in under 10 mins that designers charge thousands for. If your landing page still looks like a 2010 app, that's not an AI problem. That's a workflow problem"
    },
    {
        author: {
            name: "Andrej Karpathy",
            handle: "@karpathy",
            avatar: "https://avatars.githubusercontent.com/u/241138?v=4"
        },
        content: "I was inspired by this so I wanted to see if Claude Code can get into my Lutron home automation system."
    },
    {
        author: {
            name: "Lenny Rachitsky",
            handle: "@lennysan",
            avatar: "https://avatars.githubusercontent.com/u/1665675?v=4" // Placeholder
        },
        content: "Testing out the new Claude Cowork. I asked it to go through every Lenny's Podcast episode and pull out the 10 most important themes and lessons for product builders. Then, the 10 most counterintuitive truths. I gave it access to a folder with 320 transcripts."
    },
    {
        author: {
            name: "Pietro Schirano",
            handle: "@skirano",
            avatar: "https://avatars.githubusercontent.com/u/1680273?v=4"
        },
        content: "Claude Code isn't just for coding. I fed it my raw DNA data from an ancestry test and used it to find health related genes I should keep an eye on."
    },
    {
        author: {
            name: "zefram.eth",
            handle: "@boredGenius",
            avatar: "https://avatars.githubusercontent.com/u/38220395?v=4" // Placeholder
        },
        content: "Introducing CallMe, a minimal plugin that lets Claude Code call you on the phone. Start a task, walk away. Your phone/watch rings when Claude is done, stuck, or needs a decision. Free & open source (MIT)."
    },
    {
        author: {
            name: "Nutlope",
            handle: "@Nutlope",
            avatar: "https://avatars.githubusercontent.com/u/124599?v=4"
        },
        content: "Just used Vibe Stack's workflow for Next.js app router + Supabase. Saved me about 4 hours of boilerplate setup. The prompt library is actually insane."
    }
];


export function TestimonialsSection() {
    return (
        <section className="border-t border-border bg-black/5 py-24">
            <div className="container">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Community Vibes
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        See how developers are using AI to build faster and better.
                    </p>
                </motion.div>

                <div className="columns-1 gap-6 md:columns-2 lg:columns-3 space-y-6">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="break-inside-avoid"
                        >
                            <TweetCard {...testimonial} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
