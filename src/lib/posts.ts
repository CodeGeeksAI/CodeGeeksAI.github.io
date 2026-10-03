import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Language = 'it' | 'en';
export const languages: Language[] = ['it', 'en'];
export const postUrl = (post: Post) => `/${post.data.lang}/blog/${post.data.urlSlug}/`;

export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(date: Date, lang: Language): string {
  return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export async function visiblePosts() {
  const posts = await getCollection('posts');
  const routes = new Set<string>();
  const translations = new Set<string>();
  for (const post of posts) {
    const route = postUrl(post);
    const translation = `${post.data.lang}:${post.data.translationKey}`;
    if (routes.has(route)) throw new Error(`Duplicate post URL: ${route}`);
    if (translations.has(translation)) throw new Error(`Duplicate translation: ${translation}`);
    if (!post.id.startsWith(`${post.data.lang}/`)) {
      throw new Error(`Language does not match folder: ${post.id}`);
    }
    routes.add(route);
    translations.add(translation);
  }
  return posts
    .filter((post) => import.meta.env.DEV || !post.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
