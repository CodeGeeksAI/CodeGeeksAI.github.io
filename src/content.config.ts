import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    lang: z.enum(['it', 'en']),
    translationKey: z.string().min(1),
    urlSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    draft: z.boolean().default(true),
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/).optional(),
  }),
});

export const collections = { posts };
