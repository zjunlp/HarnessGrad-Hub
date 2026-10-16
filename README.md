# HarnessGrad website

The public introduction site: what the platform is, what it is not, plus the News and Blog
sections. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build), deployed to GitHub Pages.

This is **not** the experiment-running UI. That is [`../web/`](../web) — a separate Vite
app for comparing and debugging runs. This directory only presents the platform.

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:4321/HarnessGrad/
pnpm build      # static output in ./dist
pnpm preview    # serve the built output
```

## Layout

| Path | What it is |
| --- | --- |
| `astro.config.mjs` | `site`/`base`, the sidebar, and the two blog instances |
| `src/content.config.ts` | the docs collection, extended with the blog frontmatter schema |
| `src/content/docs/` | every page; one file is one route |
| `src/content/docs/news/` | the News instance; posts are Markdown files |
| `src/content/docs/blog/` | the Blog instance; posts are Markdown files |
| `public/` | static assets served from the site root |

## Two sections come from one plugin

`starlight-blog` is configured with **two instances** — `news` and `blog`. Each has its own
prefix and its own feed, and the posts for each live in the directory named after its
prefix, so `/news/` is fed by `src/content/docs/news/` and `/blog/` by
`src/content/docs/blog/`. Adding a post is adding a Markdown file with `title` and `date`
frontmatter; nothing else is registered by hand.

## The base path is not optional, and Astro will not do it for you

The site is served as a GitHub Pages *project* page, at
`https://zjunlp.github.io/HarnessGrad/`, so `base: '/HarnessGrad'` in `astro.config.mjs`
is load-bearing. It is what makes the canonical URLs, the RSS feeds, the asset paths and
the sidebar links correct. In development the site is also served under that prefix —
`localhost:4321/HarnessGrad/`, not `localhost:4321/`.

**The trap:** Astro applies `base` to the routes it *generates*, but **not** to
root-absolute links you write by hand. `[text](/getting-started/)` in Markdown stays
`/getting-started/`, and so does a `link:` in a hero action — which points at
`zjunlp.github.io/getting-started/` instead of the project. It renders perfectly in
`pnpm dev`, so nothing catches it until a reader clicks.

So hand-written internal links must include the base — `](/HarnessGrad/getting-started/)` —
and `pnpm build` ends by running `scripts/check-links.mjs`, which walks the built HTML and
fails on any root-absolute URL that is not under the base or does not resolve to a file.
It reads the base back out of the built canonical URL, so it follows a changed `base`
instead of going stale. Run it alone with `pnpm check:links`.

Links to repository files are written as absolute `github.com` URLs rather than as site
routes, so a reader is never sent looking for `INTERFACE.md` inside the site build.

## Node version

Astro 7 requires **Node >= 22.22.0**. On this machine `/usr/bin/node` is 22.19 and is too
old — Astro refuses to build. A suitable Node is already present:

```bash
export PATH=/opt/node-v22.22.1/bin:$PATH
pnpm build
```

CI does not need this: the workflow asks `actions/setup-node` for `node-version: 22`, which
resolves to the latest 22.x on the runner.
