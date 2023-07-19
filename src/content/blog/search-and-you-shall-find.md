---
slug: "search-and-you-shall-find"
title: "Search And You Shall Find"
author: "Mikael Lofjärd"
dateTime: 2013-04-27T00:09:35+02:00
theme: "code"
tags: [
  "blog",
  "search",
  "javascript"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Every blog should have a search box. Not because it's necessary, but because it's fun to implement.

A few weeks ago I ran across a small Javascript library called [Lunr.js](https://github.com/olivernn/lunr.js). It's basically a small text indexer that can rank search results and it's written entirely in Javascript, just the way I like it.

Setting up an index is really easy:

```js
var searchIndex = lunr(function () {
  this.field('title', { boost: 10 })
  this.field('content')
});
```

Then you just add some documents to the index:

```js
var doc = {
  id: "a-blog-post-title",
  title: "A Blog Post Title",
  content: "This is a crummy example blog post...",
};
searchIndex.add(doc);
```

Then you can search for it by simply calling `searchIndex.search('crummy blog');` and that will return an array of objects with the properties `ref` and `score`.

`ref` is the `id` property of the indexed document and `score` is, well, how well it scored. The array will be sorted with the highest scoring result first in the array.

If you want you can supply a word list to the search index with words that should not be counted, but by default it has a list of common English words such as 'and' and 'if' so that they won't be ranked and affect performance.

Overall, I'm very happy with it. I created the `SearchManager` and connected it to the `CacheManager` so that it rebuilds the index if a new post is created or one is edited. I also configured the `CacheManager` so that it does not cache URLs starting with `/search`. That way I won't fill up my cache store with all different search results.

So, if browsing the archive isn't your cup of tea, then get searching folks!
