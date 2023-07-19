---
slug: "omg-new-certificates"
title: "OMG New Certificates"
author: "Mikael Lofjärd"
dateTime: 2013-02-06T15:09:02+01:00
theme: "life"
tags: [
  "misc",
  "blog",
  "server",
  "ssl"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
One might wonder where I've been or what I've been up to these last couple of months. One would be right to wonder why I, so close to the one year anniversary of this blog, suddenly stopped writing.  
The truth is kind of embarassing.

## What did you do?

I created a bunch of SSL certificates that were set to expire in a year (by not changing the default value).  
So here I was, wanting to write to you about building a robot, going to FOSDEM, hacking away at my blog etc, but I just couldn't. Well not in any easy way anyway.

## But isn't that an easy fix?

My first thought was to generate new client certificates but that was when I realised that my server certificates had expired as well and my CA certificate had been lost in the [maintenance](http://lofjard.se/post/maintenance-in-progress) work a few months back.

So my next quest was to recreate my CA certificates but that unfortunately turned out to take longer than I expected.  
Appearantly I'm a very busy man these days because every time I sat down and got started with the certificates, something else came up and got in the way of things.

## So what's different about today

Well for one, I'm home from work tending to my daughter who has a high fever. After a morning of cartoons and blaming me for "stealing" her toy train, she finally fell asleep and lo' and behold; I have brand new CA certificates, server certificates and client certificates.

I'm back!

Oh, and dont worry! There will be a few posts about my robot.
