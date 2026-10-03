import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://CodeGeeksAI.github.io',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: true },
  },
});
