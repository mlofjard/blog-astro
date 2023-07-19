---
slug: "the-fabulous-pi"
title: "The Fabulous Pi"
author: "Mikael Lofjärd"
dateTime: 2012-10-04T21:08:31+02:00
theme: "life"
tags: [
  "server",
  "blog",
  "hardware",
  "raspberrypi"
]
pictureUrl: "rpi.png"
pictureSubText: "The Raspberry Pi, Model B, Rev 2"
pictureAltText: "Raspberry Pi Model B"
draft: false
---
In March this year I took a great leap forward in performance when I [built my in-memory cache](http://lofjard.se/post/cache-me-if-you-can). It took my blog from a paltry 5 requests per second to a whooping 62 requests per second.

Well, since then I've made some changes...

## The Replacement

Since you already know [The Plan](http://lofjard.se/post/maintenance-in-progress), let's go ahead and talk a little about what the temp agency sent over; The Raspberry Pi.

The Raspberry Pi is a $35 computer the size of a credit card. It comes with 2 USB ports, HDMI, 100 Mbit ethernet, a SD card reader for storage and it's powered by a cellphone charger. It's also quite similiar to the budget smartphone innards of yesteryear.

The Raspberry Pi packs a 700 MHz ARM 11 processor and 256 MBytes of RAM. It also has a pretty powerful GPU but I haven't used it yet so I'll leave it at that.

Having no other computer at arms length I grabbed the Raspberry Pi from a shelf and set it up as a temporary blog server.

So how did it fare?

## Raspberry Pi with nginx

Requests per second: 44.36 (mean)  
Time per request: 22.543 ms (mean)  
Transfer rate: 554.02 Kbytes/sec received

Well that's not too shabby! In fact you might not even have noticed that the blog has been served up by the Raspberry Pi for the last two days.

It's worth mentioning that a full page render without the in-memory cache (cold start) took about 2-3 seconds to run though.

## Starting fresh

Having a (miniscule) replacement up and running allowed me to move <abbr title="Itty Bitty Server">IBS</abbr> from the closet to my desk for some long needed extreme makeover.

This time around I'm running Arch Linux on it (same as on my laptop) and I'm hoping that will make it easier to maintain it, as I'll only have one distribution to keep up with.

## So what good was all this?

Request per second: 163.96 (mean)  
Time per request: 6.099 ms (mean)  
Transfer rate: 2051.47 Kbytes/sec recieved

Wow, it more than doubled the performance!

Now you might be wondering about the transfer rate being about the same as before (and much lower than it should be on the Raspberry Pi) and that's because everything now passes through nginx and gets compressed with gzip.

I've also rewritten the code so that nginx now takes care of all the static content, SSL configuration and all virtual domains. That's a huge load off the code base, and even though I liked coding those parts, they weren't that much fun to maintain and (as proven) weren't all that efficient either.

## Showing off

Just to put some perspective on how bloody fast my fantastic laptop is, here's the blog running on [jackrabbit](http://lofjard.se/post/jackrabbit):</p>

Requests per second: 1204.22 (mean)  
Time per request: 0.830 ms (mean)  
Transfer rate: 32266.94 Kbytes/sec received

Now that would put some serious strain on my internet connection.  =)
