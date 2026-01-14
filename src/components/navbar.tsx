"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/projects", label: "Projects" },
    { href: "/profiles", label: "Platforms" },
    { href: "/workflows", label: "Workflows" },
    { href: "/prompts", label: "Prompts" },
    { href: "/resources", label: "Resources" },
    { href: "/guides", label: "Guides" },
    { href: "/collections", label: "Collections" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <nav className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">Vibe Stack</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(item.href)
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Auth & Actions */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Link
                            href="/projects/new"
                            className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                        >
                            Upload Project
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
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
                        className="md:hidden border-t bg-background"
                    >
                        <div className="container py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "block py-2 text-sm font-medium transition-colors hover:text-primary",
                                        pathname.startsWith(item.href)
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <SignedIn>
                                <Link
                                    href="/projects/new"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-sm font-medium text-primary"
                                >
                                    Upload Project
                                </Link>
                            </SignedIn>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
