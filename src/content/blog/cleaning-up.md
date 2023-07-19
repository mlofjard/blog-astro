---
slug: "cleaning-up"
title: "Cleaning up"
author: "Mikael Lofjärd"
dateTime: 2011-11-26T18:22:56+01:00
theme: "life"
tags: [
  "blog",
  "couchdb"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I'm starting to have quite a few views in CouchDB and I've done my best to name them in a logical way so that I can easily see what they do by reading their names. Today I created a couple of new views and I decided that I needed to rename some old ones for clarity. Just when I was about to hit 'Save' on one of my design documents I felt a cold shiver going down my spine. I stopped and thought about it for a second and I realized that I don't have a separate database for my development environment, nor do I want to have one.

This made me take a different strategy. At the moment I have a lot of views that does the same thing but are named differently. That's because I created new views, with better names, instead of removing the old ones. I will remove the old ones after I'm done making sure that the development environment only uses the new views. That way I (hopefully) won't break my production environment all of a sudden.
