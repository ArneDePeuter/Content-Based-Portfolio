import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    work: z.boolean().default(false),
    thumbnail: z.string(),
    repo: z.string().optional(),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    organization: z.string().optional(),
    start: z.string(),
    end: z.union([z.string(), z.literal('present')]),
    category: z.enum(['education', 'work']),
    relatedPost: z.string().optional(),
    relatedPostLabel: z.string().optional(),
  }),
});

export const collections = { posts, timeline };