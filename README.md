# Code Geeks

A bilingual Italian/English blog about AI, code, and technology, built with Astro
and published as static files, with a reading-focused layout, chronological
archive, and browsing by topic.

The site includes light/dark themes, article metadata and tables of contents,
language-aware navigation, full-text search, and an empty About page. FAQ and
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
The repository includes one published example in each language and one Italian
draft; replace these with your own articles when ready.
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

`src/pages/[lang]/about.astro` contains the shared About page template. Its body is
intentionally empty after the localized heading; replace the source comment with
the team introduction when ready, using `lang` to select Italian or English text.

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

Prepared with Astro 7.3.5 on 2026-10-03. Local checks and static build pass.
GitHub deployment must still be verified in your own repository.
At preparation time, npm audit reports a high-severity advisory for the transitive
`http-cache-semantics` dependency (also attributed to Astro), with no patched version
available in npm. See https://github.com/advisories/GHSA-ch52-4w7c-c8xp.
This project publishes static files only; it does not deploy an Astro caching server.
Do not use `npm audit fix --force`, whose proposed downgrade is incompatible with this starter.
