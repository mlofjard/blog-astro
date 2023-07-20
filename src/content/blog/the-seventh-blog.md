---
slug: "the-seventh-blog"
title: "The seventh blog"
author: "Mikael Lofjärd"
dateTime: 2023-07-20T13:07:44+01:00
theme: "life"
tags: [
  "blog",
  "misc",
  "git",
  "webhooks",
  "astro"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
The seventh blog has gone live!  
I didn't dare to hope that this day would come, but a stint of bad (or not as great as usual) weather has left me with a lot of time for coding while my family wears out their phone batteries to the best of their abilities.

## The fixed and the missing
While there was quite a lot of missing features a few days ago, there is now a working archive, tag cloud and even search(!).

The latter was solved with [Orama](https://oramasearch.com/), formerly known as `Lyra`, and it does all the full-text searching client-side. It's all hooked up with a custom WebComponent and some clever index building with Astro. There will be a more complete writeup on it in the future, but for now you can check out the code over on GitHub. The link for that is at the [source page](/source).

Comments are still missing, and I have not figured out a great way of doing them yet. It will need a database of its own though, since the rest of the blog runs without a database.

Also missing is the admin area, which is for my eyes only anyway, but that will have to wait for another rainy day. For now I've set up a webhook on GitHub that calls a docker container on my server. The docker container then fetches the latest code and builds it, after which it copies it to a shared volume that the web server reads from. This makeshift pipeline works quite nicely for the moment.