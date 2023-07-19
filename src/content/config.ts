import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    author: z.string(),
    dateTime: z.date(),
    pictureUrl: z.string().nullable(),
    pictureSubText: z.string().nullable(),
    pictureAltText: z.string().nullable(),
    theme: z.string(),
    draft: z.boolean(),
  }),
});

export const collections = {
  'blog': blogCollection,
};