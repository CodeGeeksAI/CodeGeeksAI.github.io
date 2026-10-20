const covers = import.meta.glob<string>('/public/images/posts/*.webp', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
});

/** Resolve one shared cover for all translations from the build's asset list. */
export function postCoverUrl(translationKey: string): string | undefined {
  const filename = `${translationKey}.webp`;
  return covers[`/public/images/posts/${filename}`];
}
