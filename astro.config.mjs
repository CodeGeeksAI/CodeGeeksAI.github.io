import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://CodeGeeksAI.github.io',
  output: 'static',
  trailingSlash: 'always',
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'self'",
        'frame-src https://www.youtube-nocookie.com',
        "img-src 'self' https: data:",
      ],
      scriptDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://static.cloudflareinsights.com/beacon.min.js', kind: 'element' },
          { resource: "'none'", kind: 'attribute' },
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          // Shiki uses style attributes; scripts and style elements remain restricted.
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: true },
  },
});
