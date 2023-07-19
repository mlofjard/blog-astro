---
slug: "new-blog-on-the-way"
title: "New blog on the way"
author: "Mikael Lofjärd"
dateTime: 2022-04-15T21:57:49+02:00
theme: "life"
tags: [
  "nodejs",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I've spent the last week in the mountains, skiing, relaxing and eating well.  
I also took some time rewriting my blog.
The old blog relies on client certificates to enter the admin area. This worked like a charm while I had the certificates on hand, but now, 8 years, 4 computers and a whole lot of reinstalls later, they are nowhere to be found.

The new blog is written using Svelte (because why not?) and currently only lives on my laptop.  
I've written a new admin UI and established a proxy connection to my CouchDB instance through a SSH tunnel.  
All in all, I've gotten to the point where I can write new posts. (Yay!!)

The new blog won't be online for a while though since I need to write a real proxy backend for the database and set up some proper authentication for the admin UI first.

There might be screenshots in a few day.

Here's to hoping it doesn't take another 8 years for me to post again! =)
