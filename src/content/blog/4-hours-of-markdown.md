---
slug: "4-hours-of-markdown"
title: "4 Hours of Markdown"
author: "Mikael Lofjärd"
dateTime: 2013-03-29T14:17:17+01:00
theme: "life"
tags: [
  "blog",
  "misc",
  "markdown",
  "ssh"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Wow, that was kind of exhausting.

I've completed my rewrite of all my blog posts into Markdown. Somewhere in the middle I found why my inline HTML didn't work and that made my old posts look almost acceptable, but the syntax highlighted source code didn't work anymore since I had moved the highlighting code into the `marked` configuration.

So on I went into the abyss, continuing to rewrite (more like edit) all my older posts. While I was at it I re-indented all source code examples into using 2-space indentation. Man, some posts do have a lot of source code in them. =)

I made good use of SSH for connecting to my server from my parents-in-laws' cabin (where I've spent the last week).

`ssh -L 8080:localhost:5984 lofjard.se` made sure I could connect to the CouchDB instance on lofjard.se.

## tl;dr

* All posts are now written in Markdown. You will not know the difference.
* SSH is awesome.
