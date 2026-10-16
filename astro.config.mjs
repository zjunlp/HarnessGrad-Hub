// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

/**
 * The site is served as a GitHub Pages *project* page, so it lives under
 * `/<repo>/`. `site` + `base` are what make every generated absolute URL
 * (canonical, RSS, sitemap, asset paths) correct.
 */
export default defineConfig({
	site: 'https://zjunlp.github.io',
	base: '/HarnessGrad',
	integrations: [
		starlight({
			title: 'HarnessGrad',
			description:
				'A platform for running and comparing harness self-improvement methods.',
			favicon: '/favicon.svg',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/zjunlp/HarnessGrad',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/zjunlp/HarnessGrad/edit/main/website/',
			},
			// Two independent sections, as the plugin's multiple-instances guide
			// describes: posts for each live in `src/content/docs/<prefix>/`.
			plugins: [
				starlightBlog([
					{ prefix: 'news', title: 'News', navigation: 'header-start' },
					{ prefix: 'blog', title: 'Blog', navigation: 'header-end' },
				]),
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Getting started', slug: 'getting-started' },
						{ label: 'Status and limits', slug: 'status' },
					],
				},
				{
					label: 'Concepts',
					items: [{ autogenerate: { directory: 'concepts' } }],
				},
			],
		}),
	],
});
