"use client";

import Link from "next/link";
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

export function HeroSection() {
    return (
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center md:px-8">
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
                <span>The community for AI-assisted coding</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
                Build the{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    New Way
                </span>
                <br />
                with Vibe Stack
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
                Discover workflows, share projects, and master the art of vibe coding.
                Join thousands of developers building with AI.
            </motion.p>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
                <Link
                    href="/projects"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                    Explore Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                    href="/profiles"
                    className="inline-flex h-12 items-center justify-center rounded-lg border bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                    View Platforms
                </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}

export function FeaturesSection() {
    return (
        <section className="border-t bg-muted/30 py-24">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to vibe code
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From learning the basics to showcasing your projects, we've got you
                        covered.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-lg"
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
                </div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section className="border-t py-24">
            <div className="container">
                <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-2xl md:px-16">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="relative">
                        <Rocket className="mx-auto mb-6 h-12 w-12" />
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to share your project?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                            Join the community and showcase what you've built with AI coding
                            tools. Get feedback, inspire others, and build your portfolio.
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Link
                                href="/projects/new"
                                className="inline-flex h-12 items-center justify-center rounded-lg bg-background px-8 text-sm font-medium text-foreground shadow transition-colors hover:bg-background/90"
                            >
                                Upload Your Project
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
