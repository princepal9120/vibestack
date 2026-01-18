"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
    Menu,
    X,
    Sparkles,
    ChevronDown,
    Plus,
    Rocket,
    FileText,
    Star,
} from "lucide-react";
import {
    SkillsIcon,
    SubAgentsIcon,
    WorkflowsIcon,
    MCPIcon
} from "@/components/icons";
import { Logo } from "@/components/logo";

import { CommandPalette } from "@/components/command-palette";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simplified navigation with 4 main items
const navItems = [
    { href: "/projects", label: "Projects" },
];

// Collections dropdown items (without Prompts)
const collectionsItems = [
    { href: "/collections/skills", label: "Skills", icon: SkillsIcon, description: "Modular AI capabilities" },
    { href: "/collections/subagents", label: "Sub-Agents", icon: SubAgentsIcon, description: "Role-specific AI agents" },
    { href: "/collections/mcps", label: "MCPs", icon: MCPIcon, description: "Model Context Protocol" },
];


const rightNavItems = [
    { href: "/platforms", label: "Platforms" },
    { href: "/resources", label: "Resources" },
];

// GitHub Star Button with live count
function GitHubStarButton() {
    const [starCount, setStarCount] = useState<number | null>(null);

    useEffect(() => {
        // Check cache first
        const cached = localStorage.getItem("github-stars-vibestack");
        const cachedTime = localStorage.getItem("github-stars-vibestack-time");

        if (cached && cachedTime) {
            const age = Date.now() - parseInt(cachedTime);
            // Use cache if less than 5 minutes old
            if (age < 5 * 60 * 1000) {
                setStarCount(parseInt(cached));
                return;
            }
        }

        // Fetch from GitHub API
        fetch("https://api.github.com/repos/princepal9120/vibestack")
            .then((res) => res.json())
            .then((data) => {
                if (data.stargazers_count !== undefined) {
                    setStarCount(data.stargazers_count);
                    localStorage.setItem("github-stars-vibestack", data.stargazers_count.toString());
                    localStorage.setItem("github-stars-vibestack-time", Date.now().toString());
                }
            })
            .catch(() => {
                // Silently fail, just don't show the count
            });
    }, []);

    return (
        <a
            href="https://github.com/princepal9120/vibestack"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
        >
            <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                />
            </svg>
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            {starCount !== null ? (
                <span>{starCount}</span>
            ) : (
                <span className="hidden lg:inline">Star</span>
            )}
        </a>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setCollectionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isCollectionsActive = pathname.startsWith("/collections");

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <nav className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight">Vibe Stack</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-1">
                    {/* Projects */}
                    {navItems.map((item) => (
                        <div className="relative" key={item.href}>
                            {pathname.startsWith(item.href) && (
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 rounded-lg bg-primary/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Link
                                href={item.href}
                                className={cn(
                                    "relative z-10 block px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                    pathname.startsWith(item.href)
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}

                    {/* Collections Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setCollectionsOpen(!collectionsOpen)}
                            onMouseEnter={() => setCollectionsOpen(true)}
                            className={cn(
                                "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                                isCollectionsActive
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground"
                            )}
                        >
                            Collections
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                collectionsOpen && "rotate-180"
                            )} />
                        </button>

                        <AnimatePresence>
                            {collectionsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    onMouseLeave={() => setCollectionsOpen(false)}
                                    className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl shadow-black/10"
                                >
                                    {collectionsItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setCollectionsOpen(false)}
                                            className={cn(
                                                "flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent",
                                                pathname.startsWith(item.href) && "bg-primary/5"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <div className={cn(
                                                    "text-sm font-medium",
                                                    pathname.startsWith(item.href) ? "text-primary" : "text-foreground"
                                                )}>
                                                    {item.label}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right nav items */}
                    {rightNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                                pathname.startsWith(item.href)
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Auth & Actions */}
                <div className="flex items-center gap-3">
                    {/* Global Search */}
                    <CommandPalette />

                    {/* GitHub Star */}
                    <GitHubStarButton />

                    {/* Submit Dropdown */}
                    <div className="relative hidden sm:block group">
                        <button
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4" />
                            Submit
                            <ChevronDown className="h-3 w-3" />
                        </button>
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl shadow-black/10 transition-all duration-150">
                            <Link
                                href="/submit/project"
                                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                            >
                                <Rocket className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">Submit Project</div>
                                    <div className="text-xs text-muted-foreground">Showcase your AI-built app</div>
                                </div>
                            </Link>
                            <Link
                                href="/submit/resource"
                                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
                            >
                                <FileText className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-foreground">Submit Resource</div>
                                    <div className="text-xs text-muted-foreground">Share a blog, video, or tutorial</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-accent transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-accent"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-background"
                    >
                        <div className="container py-4 space-y-1">
                            {/* Projects */}
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block py-3 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                                        pathname.startsWith(item.href)
                                            ? "text-primary bg-primary/5"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Collections Section */}
                            <div className="py-2">
                                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Collections
                                </div>
                                {collectionsItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                                            pathname.startsWith(item.href)
                                                ? "text-primary bg-primary/5"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Right nav items */}
                            {rightNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block py-3 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent",
                                        pathname.startsWith(item.href)
                                            ? "text-primary bg-primary/5"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* Submit options for mobile */}
                            <div className="pt-3 mt-3 border-t border-border space-y-1">
                                <Link
                                    href="/submit/project"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium bg-primary/5 text-primary"
                                >
                                    <Rocket className="h-4 w-4" />
                                    Submit Project
                                </Link>
                                <Link
                                    href="/submit/resource"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent"
                                >
                                    <FileText className="h-4 w-4" />
                                    Submit Resource
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
