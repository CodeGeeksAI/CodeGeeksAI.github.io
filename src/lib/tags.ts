import type { Language, Post } from './posts';

export interface Tag {
  name: string;
  slug: string;
  count: number;
}

/** Tag identifiers are shared across translations and validated by the content schema. */
export function getTags(posts: readonly Post[]): Tag[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.data.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([tag, count]) => ({ name: tag, slug: tag, count }));
}

export const tagUrl = (lang: Language, tag: string): string => `/${lang}/tags/${tag}/`;

export function postsForTag(posts: readonly Post[], lang: Language, tag: string): Post[] {
  return posts.filter((post) => post.data.lang === lang && post.data.tags.includes(tag));
}
