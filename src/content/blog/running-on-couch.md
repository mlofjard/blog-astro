---
slug: "running-on-couch"
title: "Running on Couch"
author: "Mikael Lofjärd"
dateTime: 2011-11-12T15:21:00+01:00
theme: "life"
tags: [
  "couchdb",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I'm home from &Oslash;redev and I just couldn't resist using some of my new found inspiration to get some work done on the blog.

Apache is no more! The blog now runs fully on node.js and I even got around to putting all my static blog posts into CouchDB and it is now read from disk (or cache most likely) and then templated with Mustache to form my blog.

This means that I can finally have unique links for each blog post which should make it a bit easier for me to promote my updates.

As I currently don't have any way of writing posts on the site, I use the CouchDB admin interface. This I feel will probably change some time in the future, but for now it works for me.
