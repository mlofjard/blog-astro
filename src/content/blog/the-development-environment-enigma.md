---
slug: "the-development-environment-enigma"
title: "The Development Environment Enigma"
author: "Mikael Lofjärd"
dateTime: 2012-03-03T11:22:26+01:00
theme: "life"
tags: [
  "blog",
  "linux",
  "nodejs",
  "couchdb"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
As you might have noticed, there hasn't been much work done on the blog these last few months. It kind of boils down to complexity.

## The Old Setup

When I started building this blog my main workstation was running Windows 7. Everything ran as well on Node.js on Windows as it did on my Linux server. It was a nice and simple setup; develop locally, test locally, deploy on server.

## Enter CouchDB

Then I added a database. Specifically CouchDB that only worked on Linux. This meant a new, more complex development routine; develop locally, deploy on server, test on server, rince and repeat in case of error.

This worked for a while but lately as the code has gotten more complex and it does a lot of pre-caching on startup, I've been longing for a locally deployed test version again.

## The Switch

So I decided to switch my main workstation over to Linux again. I've been away from the Linux desktop for a few years (having only server installations at home), but I felt that it was time for me to get back to my roots.

## WTF!?

I have very fond memories of Linux from the late 1990's, early 2000s. It was fast, lightweight, fast, beautiful and fast. I think you can see where I'm going with this.

What is up with the Linux desktop of today? I've been looking at screenshots of the the latest Ubuntu with Unity and it looks like crap, so I installed Linux Mint hoping that Gnome would at least have a more polished look. Boy was I wrong. Gnome 3 also looks like crap. There are these little ugly inconsistencies showing up all over the place; scroll bars, menu placement, font-sizes, you name it.

And it is soooo painfully slow. I mean, when I click on a f-ing menu, I don't want to wait for half a second before it pops up. If my menus could feel fast 10 years ago, why can'tit do the same now? 

Now, I know there's a lot more going on with all these modern composition managers and what-not, but I just want a clean, fast, two-dimensional development environment.

## Let's Do The Time Warp Again

So I figured I'd install some old school (fast) window manager and spend some hours configuring its quirky text config files like back in the old days. Fluxbox (fka Openbox, fka Blackbox and so on) was probably the fastest one I could remember so that's what I installed. Awesome!

## Damn You Linux Mint

For some weird reason that I can't figure out I can't compile the "latest" CouchDB and Couchbase Single Server has been discontinued so I can't use Linux Mint anyway.

So now I'm going to bite the bullet, install Ubuntu and then kick Unity in the teeth and install Fluxbox again.

## TL;DR

* The new WMs in Linux sucks, looks ugly, are to slow.
* Couchbase annoys me.
* Things will never be as fast as when Slackware still used libc (3.6 FTW!).
