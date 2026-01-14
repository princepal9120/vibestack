"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-background/50 p-6 shadow-sm backdrop-blur-xl transition-colors hover:bg-accent/5",
                "border-border/50 hover:border-primary/50",
                className
            )}
        >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>

            {/* Decorative gradient blob */}
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-all duration-500 group-hover:bg-primary/30" />
        </motion.div>
    );
}
