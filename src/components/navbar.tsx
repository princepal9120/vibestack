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
} from "lucide-react";
import {
    SkillsIcon,
    PromptsIcon,
    SubAgentsIcon,
    WorkflowsIcon,
    MCPIcon
} from "@/components/icons";
import { Logo } from "@/components/logo";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simplified navigation with 4 main items
const navItems = [
    { href: "/projects", label: "Projects" },
];

// Collections dropdown items
const collectionsItems = [
    { href: "/collections/skills", label: "Skills", icon: SkillsIcon, description: "Modular AI capabilities" },
    { href: "/collections/prompts", label: "Prompts", icon: PromptsIcon, description: "Copy-paste ready prompts" },
    { href: "/collections/subagents", label: "Sub-Agents", icon: SubAgentsIcon, description: "Role-specific AI agents" },
    { href: "/collections/workflows", label: "Workflows", icon: WorkflowsIcon, description: "Best practices & guides" },
    { href: "/collections/mcps", label: "MCPs", icon: MCPIcon, description: "Model Context Protocol" },
];


const rightNavItems = [
    { href: "/platforms", label: "Platforms" },
    { href: "/resources", label: "Resources" },
];

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
