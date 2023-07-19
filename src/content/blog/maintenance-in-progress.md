---
slug: "maintenance-in-progress"
title: "Maintenance In Progress"
author: "Mikael Lofjärd"
dateTime: 2012-09-30T19:49:14+02:00
theme: "life"
tags: [
  "blog",
  "server",
  "hardware",
  "raspberrypi"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I've embarked upon my mission to upgrade my server installation. It's probably going to take the better part of this week but I hope to be done by this weekend when my parents-in-law are coming to stay with us.

Here's my todo-list as of now.

1. Find a temporary server to host the blog on while installing new stuff on <abbr title="Itty Bitty Server">IBS</abbr>.
    1. Grab nearest piece of unused computer tech capable of running Linux.  
(Yay, my RaspberryPi)
    1. Install Raspbian.<br/>(Since it's just a temporary server I didn't bother playing with Arch Linux ARM. Raspbian is what most people are using on their RPis so I figured it would have a decent repository of pre-compiled software.)
    1. Install nginx.  
(This was easy, it was in the repos.)
    1. Install CouchDB.  
(Again, in the repos).
    1. __Install Node.js.  
(This is where I'm currently at. It's a little trickier, requiring compiling from source for version 0.8.x and editing a couple of lines in the V8 configuration to allow ARM v6 compilation. It also takes a LOOOONG time to compile on the RPi)__
    1. Setup the blog on the RPi.
1. Redirect lofjard.se to point to the RaspberryPi.
1. Install Arch Linux on <abbr title="Itty Bitty Server">IBS</abbr>.
    1. Install nginx.
    1. Install CouchDB.
    1. Install Node.js.
(All easy on Arch Linux thanks to fantastic repos.)
    1. Setup the blog on <abbr title="Itty Bitty Server">IBS</abbr>.
1. Re-redirect lofjard.se back to <abbr title="Itty Bitty Server">IBS</abbr>.
1. Benchmark  
(The use of nginx for static content instead of node-static should make for a nice performance boost in conjunction with the removal of some now redundant code.)
1. Keep calm and carry on!
