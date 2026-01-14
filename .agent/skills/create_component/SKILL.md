---
name: create_component
description: Create a new React UI component following Vibe Stack design system, architectural standards, and animation patterns.
---

# Create UI Component Skill

Use this skill when the user asks to create a new UI component.

## Standards & patterns

### 1. Component Structure

- Use `export function ComponentName({ prop }: Props)` syntax. **Do not** use arrow functions for top-level component definitions.
- Place components in `src/components/` (or `components/`).
- Use `lucide-react` for icons.

### 2. Styling (Tailwind CSS)

- Use `cn()` utility for class merging.
- Use mobile-first responsive prefixes (e.g., `flex-col md:flex-row`).
- Adhere to the design system colors.

### 3. Animation (Framer Motion)

- Use `framer-motion` for complex animations ("industry standard" feel).
- **Requirement:** Must add `'use client'` directive at the top of the file if using `motion` components.
- **Pattern:** Use `initial`, `animate`, `exit` props for enter/exit animations.
- **Pattern:** Use `whileHover`, `whileTap` for interactions.

### 4. Props & Typing

- Define a `Props` interface.
- Use explicit types.

### 5. Implementation Template (Animated)

```tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: LucideIcon;
}

export function ComponentName({
  title,
  icon: Icon,
  className,
  ...props
}: ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "flex items-center gap-2 p-4 border rounded-lg bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      <h3 className="font-medium">{title}</h3>
    </motion.div>
  );
}
```
