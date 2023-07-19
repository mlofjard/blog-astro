import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const get: APIRoute = async function get() {

   const posts = await getCollection("blog");

   const body = JSON.stringify({
      posts: posts.map((post) => ({
         title: post.data.title,
         dateTime: post.data.dateTime.toISOString(),
         theme: post.data.theme,
         content: post.body.replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"),
         path: `/post/${post.slug}`,
      })),
   });

   return {
      body,
   };
}