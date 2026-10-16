import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// `blogSchema` is what adds the frontmatter (`date`, `authors`, `tags`,
		// cover image, ...) that the blog and news instances read.
		schema: docsSchema({ extend: (context) => blogSchema(context) }),
	}),
};
