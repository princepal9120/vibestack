"use client";

import { motion } from "motion/react";

export function HeroTitle() {
    return (
        <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-2">
                Browse 200+ Claude Code Sub-Agent Prompts
            </h2>
            <p className="text-muted-foreground text-center text-sm">
                Copy-paste ready prompts for React, Python, TypeScript, Go, and more frameworks.{" "}
                <a
                    href="https://docs.anthropic.com/en/docs/build-with-claude/claude-code/sub-agents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                >
                    New to Claude Code?
                </a>
            </p>
        </motion.div>
    );
}
