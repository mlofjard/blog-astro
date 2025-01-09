import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from "astro";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export const get: APIRoute = async function get() {
  const fetchedArticles = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });
  fetchedArticles.sort((a, b) => (a.data.dateTime < b.data.dateTime ? 1 : -1));


  return rss({
    title: 'Mikael’s blog',
    description: 'A developers seventh time trying to maintain a blog',
    site: 'https://blog.lofjard.se',
    trailingSlash: false,
    items: fetchedArticles.map((post) => ({
      link: `/blog/${post.slug}/`,
      title: post.data.title,
      pubDate: post.data.dateTime,
      description: sanitizeHtml(parser.render(post.body), {
        allowedTags: []
      }).substring(0, 100).replace(/\.(?:.(?!\.))+$/, '.'),
      author: post.data.author,
      // Note: this will not process components or JSX expressions in MDX files.
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
}
