---
slug: "svelte-blog-0-1--alpha-"
title: "Svelte-Blog 0.1 (alpha)"
author: "Mikael Lofjärd"
dateTime: 2023-06-11T15:22:51+02:00
theme: "code"
tags: []
pictureUrl: ""
pictureSubText: ""
pictureAltText: ""
draft: false
---
## New face
The blog has gotten a face lift with some fresh new styling. In the last 8 years I've probaly redesigned it 4 times. It always ends with me not completing my design and/or getting bored with it. Even this design is not the one I spoke of in the last update.

## New tech
Even though the design is new, the blog itself is the same one I wrote about last year. It's written in Svelte, and compiled to a static page. Instead of having my own API in Node.js it talks to the CouchDB database directly through its REST API.

Authelia is setup to handle authentication and authorization to the admin area and database backend, ensuring write access to only those deemed worthy.

## Missing features
There are currently a lot of things missing in this blog that were available before. They will get implemented over time, but I figured I had better get this version deployed now or it might never happen at all.

The missing feature list includes (but is not exclusive to):

* Source code view (it's on GitHub now instead)
* Volumetric tag cloud
* Comments (they are readable, but you can't post new ones)
* Search (this one usually stopped working randomly in the old engine anyway)

## New life
Will this mean that I will write more blog posts? Who knows? I can't make any promisses. Only time will tell.
