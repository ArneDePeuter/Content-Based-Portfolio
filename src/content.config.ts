import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    start: z.string(), // YYYY-MM
    end: z.union([z.string(), z.literal('present')]),
    category: z.enum(['education', 'work']),
    relatedPost: z.string().optional(), // e.g. "internship-reflection"
    relatedPostLabel: z.string().optional(),
  }),
});

export const collections = { projects, posts, timeline };