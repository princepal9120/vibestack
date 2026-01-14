import Link from "next/link";
import { Sparkles, Github, Twitter } from "lucide-react";

const footerLinks = {
    product: [
        { href: "/projects", label: "Projects" },
        { href: "/profiles", label: "Platforms" },
        { href: "/collections", label: "Collections" },
    ],
    resources: [
        { href: "/profiles/cursor", label: "Cursor Guide" },
        { href: "/profiles/claude-code", label: "Claude Code Guide" },
        { href: "/profiles/replit", label: "Replit AI Guide" },
    ],
    company: [
        { href: "/about", label: "About" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-12 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight">Vibe Stack</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            The community-driven platform for AI-assisted coding.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Vibe Stack. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
