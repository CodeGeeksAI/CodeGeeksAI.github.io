# Code Geeks

A bilingual Italian/English blog about AI, code, and technology, built with Astro
and published as static files, with a reading-focused layout, chronological
archive, and browsing by topic.

The site includes light/dark themes, article metadata and tables of contents,
language-aware navigation, full-text search, and a bilingual About page. FAQ and
social links are prepared in the code and disabled until their content is ready.

## Setup

1. Install Node.js 24 and Git.
2. Run `npm ci` and `npm run dev`.
3. Visit http://localhost:4321/it/ or http://localhost:4321/en/.
4. Run `npm run verify` before committing; it runs Astro checks and a production build.
5. Use `npm run preview` to inspect the production output locally.
6. Include all sources, `package-lock.json`, and `.github/workflows/site.yml` in pull requests.
7. In repository Settings > Pages, choose GitHub Actions as the source.

The configured production URL in `astro.config.mjs` is
`https://CodeGeeksAI.github.io`. The root URL redirects to `/it/`.

## Pages and languages

Each language has these routes, where `lang` is `it` or `en`:

| Route | Content |
| --- | --- |
| `/{lang}/` | Articles, newest first |
| `/{lang}/blog/{urlSlug}/` | Individual article |
| `/{lang}/archive/` | Articles grouped by year and month |
| `/{lang}/tags/` | Alphabetical tag list with article counts |
| `/{lang}/tags/{tag}/` | Articles with a specific tag |
| `/{lang}/search/` | Search within the current language |
| `/{lang}/about/` | Chi siamo / About us |

The header language switch opens the corresponding page or article translation
when it exists. If no visible counterpart exists, it opens the selected language's
home page. Articles also link directly to their available translation. Publishing
one language before the other is supported.

## Content

Write Markdown in `src/content/posts/it/` and `src/content/posts/en/`.
The first article is available as a draft in Italian (`grill-me-prima-del-codice.md`)
and English (`grill-me-before-coding.md`).
For example, an Italian article can start with:

```yaml
---
title: "Capire i modelli linguistici"
description: "Un'introduzione ai modelli linguistici con esempi verificabili."
pubDate: 2026-10-03
lang: it
translationKey: understanding-language-models
urlSlug: capire-i-modelli-linguistici
tags: [ai, language-models]
author: Code Geeks
draft: false
---
```

Use the same `translationKey` for the English translation, set `lang: en`, and
choose an English `urlSlug`, such as `understanding-language-models`. The `lang`
value must match the containing folder. Article URLs and translation keys must
be unique within each language; these checks also apply to drafts.

Titles, descriptions, dates, language, translation keys, and URL slugs are required.
`author` defaults to `Code Geeks`, `tags` defaults to an empty list, and `draft`
defaults to `true`. Set `draft: false` to include an article in production.
Development includes drafts; production excludes them from article routes,
lists, archives, search, and tags.
Dates are metadata; they do not schedule publication or hide future-dated posts.
Dates display in the selected language using UTC. Reading time is estimated at
200 words per minute, with a minimum of one minute.
Set optional `youtubeId` to an 11-character YouTube video ID to show a player.

### Article covers

Add a single WebP file to `public/images/posts/`, named after the article's
`translationKey`. The article template automatically displays it above the title
in both languages. No frontmatter image field or Markdown image is needed.
Articles without a matching file display normally, without an empty placeholder.
File names are case-sensitive; use the exact translation key and `.webp` extension.

For example, both translations of the grill-me article use
`translationKey: grill-me-before-coding`, so their shared cover is:

```text
public/images/posts/grill-me-before-coding.webp
```

Prepare all covers at **1600 × 900 pixels (16:9)** and export as WebP, ideally
under 300 KB. Verify dimensions after AI generation and resize or crop before
adding the file. The template reserves a 16:9 area to prevent layout shifts,
scales it to the article width on every screen, and crops other aspect ratios
to fit. It does not convert files or enforce their source pixel dimensions.
Keep important elements away from the edges. Use a consistent illustration
style and palette, without text, logos, or watermarks, so one image works in
both languages. These covers are decorative introductions to the article;
their empty alternative text avoids repeating the adjacent article title.
Keep any information needed to understand the article in its text.

Reusable generation prompt (replace the bracketed subjects):

> Crea una copertina editoriale per un articolo su [ARGOMENTO]. Illustrazione
> vettoriale con contorni netti, forme semplici, palette coerente e composizione
> orizzontale. Rappresenta visivamente [CONCETTO PRINCIPALE]. Nessun testo,
> lettering, logo o watermark. Rapporto 16:9, dimensioni finali 1600 × 900 pixel.

Run `npm run dev` to inspect the cover, then `npm run verify`. Adding or replacing
a cover on the published site requires a new build and deployment, like other
content changes. Covers appear on individual articles; list cards remain text-only.

### Article contents

Articles with at least one Markdown `##` or `###` heading automatically show an
index ("Indice" in Italian, "Contents" in English), with subsections nested under
their parent section. At desktop widths of 1100px and above, the index stays in a
sticky right sidebar; on smaller screens it appears in an expandable box before
the article body. The current section is highlighted while scrolling. Links work
without JavaScript, and articles without these headings keep the single-column
layout. No frontmatter setting or manually maintained list is needed.

### Tags

Use canonical English tag identifiers shared across both languages, for example
`ai`, `machine-learning`, and `language-models`. Identifiers must contain only
lowercase ASCII letters, digits, and single hyphens between words; spaces,
uppercase letters, leading/trailing hyphens, and repeated hyphens are rejected.
Duplicate tags on one article are removed automatically.

The identifier is both the displayed label and its URL slug. Reuse the same tags
on an article and its translation so the language switch can open the matching
tag page. Tag counts and listings include only visible articles in the current
language; an Italian article and its English translation do not inflate either
language's count. A tag page is generated only when that language has a visible
article using the tag.

### Search

Search runs in the browser against a static index embedded in the search page.
It includes titles, descriptions, tags, and the Markdown body of visible articles
in that page's language. Queries are case- and accent-insensitive; all search
terms must match. The query is reflected in `?q=` so searches can be bookmarked.
Without JavaScript, the page still lists all articles in the current language.

## About, FAQ, and social links

`src/pages/[lang]/about.astro` contains the shared About page template. Both languages
include the team introduction and individual profiles, ordered by surname:
Luca Colangiuli, then Fedele Mantuano. Luca's photo and full biography are still to
be supplied; the page displays a photo placeholder and a provisional profile.

Link to the profiles from Italian articles with
`[Luca Colangiuli](/it/about/#luca-colangiuli)` and
`[Fedele Mantuano](/it/about/#fedele-mantuano)`. Keep these section IDs stable.
Fedele's supplied portrait is stored at `public/images/team/fedele-mantuano.png`;
add Luca's photo to the same directory when available and replace the placeholder.

Article cards and article headers automatically link `author: Fedele Mantuano`
and `author: Luca Colangiuli` to the corresponding profile in the article's language.
The default `author: Code Geeks` links to that language's About page. Other author
names remain plain text. These links are rendered by `src/components/AuthorLink.astro`;
keep its profile IDs in sync with the About sections. Frontmatter remains plain text.

Site identity, descriptions, and future feature settings live in
`src/config/site.ts`:

- **FAQ:** add `{ question, answer }` entries to `siteConfig.faq.it` and
  `siteConfig.faq.en`, then set `siteConfig.features.faq` to `true`. The
  `/{lang}/faq/` route and navigation link appear only for languages with entries.
- **Social links:** add `{ label, url }` entries to `siteConfig.socialLinks`, using
  `https://` URLs, then set `siteConfig.features.social` to `true`. The same links
  appear on both language homepages.

Both features are currently disabled and their content lists are empty.
Content and configuration changes take effect after rebuilding and deploying
the static site.

## Workflow

Pull requests run type checks and a production build. Pushes to `main` run the
same checks and then deploy to Pages. No pull request preview is hosted.
Make changes on a feature branch, push it, and open a pull request into `main`.
Merging the pull request starts the publishing workflow.
Reviews are configured on GitHub. No AI/editorial review is included.
The active GitHub ruleset requires a pull request for every change to `main`,
including changes by administrators. Only squash merging is enabled; direct
pushes, force pushes, and branch deletion are blocked. No approving review is
required, so a solo maintainer can merge their own pull requests.
The `Verify` workflow runs on every pull request but is not currently configured
as a required status check in the ruleset.

This site is served at the domain root. A project URL such
as `<username>.github.io/blog/` requires configuring `base` and adapting internal links.

## Verification and dependency status

The project uses Astro 7.3.5 and publishes static files only. The lockfile resolves
`http-cache-semantics` to 4.3.0. Run `npm ci`, `npm audit`, and `npm run verify` to
check the locked dependencies and production build. Avoid `npm audit fix --force`,
which can introduce incompatible dependency changes.

GitHub Actions are pinned to full commit SHAs. When updating an Action, verify the
replacement commit in its official repository and update its version comment.

Production builds include a Content Security Policy generated by Astro. Scripts
are limited to the same origin, build-generated hashes, and the Cloudflare Web
Analytics beacon at `https://static.cloudflareinsights.com/beacon.min.js`. Connections
are limited to the same origin and `https://cloudflareinsights.com`. The initial theme
script is served from `/theme-init.js` and runs before visible page content. Inline
style attributes remain allowed for Shiki syntax highlighting, while script attributes
and arbitrary inline scripts are blocked. YouTube embeds use
`https://www.youtube-nocookie.com`, and article images may use HTTPS sources.
Check theme switching, search, code highlighting, and video embeds in a production
preview after policy changes: CSP is not enforced by Astro's development server.
Astro currently emits a generic Shiki/CSP warning even with the explicit style
attribute allowance; syntax highlighting has been verified in a production browser.

The policy is delivered through a meta tag on GitHub Pages. Directives that require
HTTP headers, such as `frame-ancestors`, must be configured at a compatible hosting
layer if needed. Local validation does not verify a deployment on GitHub Pages.

## Web analytics

Production pages using `src/layouts/Base.astro` include the Cloudflare Web Analytics
snippet for `codegeeksai.github.io`, covering both Italian and English routes. The
root redirect is not tracked separately. The snippet is omitted by `npm run dev`;
`npm run preview` serves the production output, which includes it.

The `data-cf-beacon` token is a public site identifier supplied by Cloudflare, not
an account API credential. View the statistics in the Cloudflare account's
Web Analytics dashboard. Data collection begins after this change is deployed;
confirm incoming visits in the dashboard after publication.

The CSP allows the external beacon script and its reporting endpoint, as described
in [Cloudflare's CSP guidance](https://developers.cloudflare.com/web-analytics/faq/#what-do-i-need-to-add-to-my-content-security-policy-csp).
