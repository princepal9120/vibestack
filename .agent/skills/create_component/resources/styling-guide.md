# Styling Guide (Tailwind CSS)

## Core Principles

1.  **Mobile First**: Design for mobile, then add `sm:`, `md:`, `lg:` modifiers.
2.  **Semantic Colors**: Use `bg-background`, `text-foreground`, `bg-primary` instead of hardcoded hex or `bg-slate-900`. This ensures dark mode works automatically.
3.  **Typography**: Use `text-sm`, `font-bold`, `tracking-tight` consistent with the design tokens.

## Common Utility Combinations

- **Glassmorphism**: `bg-background/80 backdrop-blur-md border border-border/50`
- **Flex Center**: `flex items-center justify-center`
- **Focus Ring**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- **Card Skeleton**: `rounded-lg border bg-card text-card-foreground shadow-sm`

## Dark Mode

Vibe Stack uses `next-themes` and standard Shadcn/Tailwind variables.

- Always check contrast on `muted-foreground` (usually text-gray-500).
- Use `border-border` (not `border-gray-200`) to respect theme.
