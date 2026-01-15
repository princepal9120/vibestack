import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";

export interface Rule {
    title: string;
    slug: string;
    description: string;
    tags: string[];
    libs: string[];
    content: string;
}

export type Section = {
    tag: string;
    rules: Rule[];
    slug: string;
};

const categoryMappings: Record<string, string> = {
    "01-core-development": "Core Development",
    "02-language-specialists": "Language Specialists",
    "03-infrastructure": "Infrastructure",
    "04-quality-security": "Quality & Security",
    "05-data-ai": "Data & AI",
    "06-developer-experience": "Developer Experience",
    "07-specialized-domains": "Specialized Domains",
    "08-business-product": "Business & Product",
    "09-meta-orchestration": "Meta Orchestration",
    "10-research-analysis": "Research & Analysis",
};

function slugToTitle(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function loadRules(): Rule[] {
    const contentDir = path.join(process.cwd(), "content");

    if (!fs.existsSync(contentDir)) {
        return [];
    }

    const rules: Rule[] = [];
    const categoryFolders = fs.readdirSync(contentDir);

    for (const folder of categoryFolders) {
        const folderPath = path.join(contentDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const categoryName = categoryMappings[folder] || folder;
        const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".md") && f !== "README.md");

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data, content } = matter(fileContent);

            let libs: string[] = [];
            if (typeof data.tools === "string") {
                libs = data.tools.split(",").map((t: string) => t.trim());
            } else if (Array.isArray(data.tools)) {
                libs = data.tools;
            }

            const slug = data.name || file.replace(".md", "");

            rules.push({
                title: slugToTitle(slug),
                slug,
                description: data.description || "",
                tags: [categoryName],
                libs,
                content: content.trim(),
            });
        }
    }

    return rules;
}

export const rules: Rule[] = loadRules();

export function getSections(): Section[] {
    const categories = Array.from(new Set(rules.flatMap((rule) => rule.tags)));

    return categories
        .map((tag) => ({
            tag,
            rules: rules.filter((rule) => rule.tags.includes(tag)),
            slug: slugify(tag, { lower: true }),
        }))
        .sort((a, b) => b.rules.length - a.rules.length);
}

export function getSectionBySlug(slug: string) {
    return getSections().find((section) => section.slug === slug);
}

export function getRuleBySlug(slug: string) {
    return rules.find((rule) => rule.slug === slug);
}

export function getRelatedRules(slug: string, limit = 4): Rule[] {
    const currentRule = getRuleBySlug(slug);
    if (!currentRule) return [];

    const currentTags = currentRule.tags;
    const currentLibs = new Set(currentRule.libs);

    return rules
        .filter((rule) => rule.slug !== slug)
        .map((rule) => {
            let score = 0;
            if (rule.tags.some((tag) => currentTags.includes(tag))) {
                score += 10;
            }
            const sharedLibs = rule.libs.filter((lib) => currentLibs.has(lib)).length;
            score += sharedLibs * 2;
            return { rule, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ rule }) => rule);
}
