# Astro bilingual blog

A minimal teaching starter for a public `<username>.github.io` repository.

## Setup

1. Install Node.js 24 and Git.
2. Replace `YOUR_USERNAME` in `astro.config.mjs` with your GitHub username.
3. Run `npm ci` and `npm run dev`.
4. Visit http://localhost:4321/it/ or http://localhost:4321/en/.
5. Run `npm run verify` before committing.
6. Commit all sources, including `package-lock.json` and `.github/workflows/site.yml`.
7. In repository Settings > Pages, choose GitHub Actions as source.

## Content

Write Markdown in `src/content/posts/it/` and `src/content/posts/en/`.
Use the same `translationKey` for translations, and a distinct `urlSlug` in each language.
Set `draft: false` to include a post in production. Development includes drafts.
Dates are metadata; they do not schedule publication or hide future-dated posts.
Set `youtubeId` to an 11-character YouTube video ID to show a player.

The language links in the header open the language index. A separate link inside
each post opens its translation when a visible counterpart exists.
The starter permits publishing one language before the other.

## Workflow

Pull requests run type checks and a production build. Pushes to `main` run the
same checks and then deploy to Pages. No pull request preview is hosted.
Reviews are configured on GitHub. No AI/editorial review is included.
Protect `main` and require the `Verify` check after its first successful run.
If you work alone, do not require another person's approval.

This starter assumes the site is served at the domain root. A project URL such
as `<username>.github.io/blog/` requires configuring `base` and adapting internal links.

## Verification and dependency status

Prepared with Astro 7.3.5 on 2026-10-03. Local checks and static build pass.
GitHub deployment must still be verified in your own repository.
At preparation time, npm audit reports a high-severity advisory for the transitive
`http-cache-semantics` dependency (also attributed to Astro), with no patched version
available in npm. See https://github.com/advisories/GHSA-ch52-4w7c-c8xp.
This project publishes static files only; it does not deploy an Astro caching server.
Do not use `npm audit fix --force`, whose proposed downgrade is incompatible with this starter.
