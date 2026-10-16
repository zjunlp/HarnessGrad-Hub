#!/usr/bin/env node
/**
 * Fail the build if a link in `dist/` would 404 once deployed.
 *
 * Why this exists: Astro applies the configured `base` to the routes it generates, but
 * **not** to root-absolute links written by hand — `](/foo/)` in Markdown stays `/foo/`,
 * and so does `link: /foo/` in a hero action. On a GitHub Pages *project* page that
 * silently points at the domain root instead of the project, and the page renders fine
 * locally, so nothing catches it until a reader clicks.
 *
 * The base is not duplicated here: it is read back out of the built canonical URL, so if
 * `base` in `astro.config.mjs` changes, the check follows it rather than going stale.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve(process.argv[2] ?? 'dist');

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
const canonical = /<link rel="canonical" href="([^"]+)"/.exec(indexHtml);
if (!canonical) {
  console.error('check-links: no canonical URL in dist/index.html — did the build run?');
  process.exit(1);
}
const BASE = new URL(canonical[1]).pathname.replace(/\/$/, '');
console.log(`check-links: base = ${BASE} (read back from the built canonical URL)`);

/** Every `.html` file under dist/, as a path relative to dist/. */
const pages = (function walk(dir, prefix = '') {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) found.push(...walk(join(dir, entry.name), rel));
    else if (entry.name.endsWith('.html')) found.push(rel);
  }
  return found;
})(DIST);

/** Strip query and fragment, and ignore anything that is not a root-absolute URL. */
const toPath = (url) => {
  if (url.startsWith('//')) return null;
  const path = url.split('#')[0].split('?')[0];
  return path.startsWith('/') ? path : null;
};

/** Would the server return something for this URL? */
const resolves = (path) => {
  const rel = path.slice(BASE.length).replace(/^\//, '');
  const target = join(DIST, rel);
  if (existsSync(target)) {
    return statSync(target).isDirectory() ? existsSync(join(target, 'index.html')) : true;
  }
  return existsSync(join(DIST, rel, 'index.html'));
};

const problems = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(join(DIST, page), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const path = toPath(match[1]);
    if (path === null) continue;
    checked += 1;
    if (path !== BASE && !path.startsWith(`${BASE}/`)) {
      problems.push(`${page}: ${match[1]} is not under the base path ${BASE}`);
    } else if (!resolves(path)) {
      problems.push(`${page}: ${match[1]} does not resolve to a file in dist/`);
    }
  }
}

console.log(`check-links: ${checked} internal URL(s) across ${pages.length} page(s)`);
if (problems.length > 0) {
  console.error(`\ncheck-links: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    `\nHand-written root-absolute links must include the base path, e.g. \`](${BASE}/getting-started/)\`.`
  );
  process.exit(1);
}
console.log('check-links: OK');
