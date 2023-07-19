---
slug: "a-new-home"
title: "A New Home"
author: "Mikael Lofjärd"
dateTime: 2012-01-06T12:51:58+01:00
theme: "life"
tags: [
  "hardware",
  "blog",
  "server"
]
pictureUrl: "lianliq11b.jpg"
pictureSubText: "My new server chassi"
pictureAltText: "Lian Li Q11B"
draft: false
---
I finally ordered a new server. It will probably take a few days to get it running (first I have to get the parts delivered), but at least I get to build a computer again. It was ages ago that I did my last build and I've never even touched an SSD or for that part anything using the SATA interface. That's how old I am; when I built my last computer, we all used IDE.

The server computer is going to run my blog on a Linux OS somewhat similar to my current setup which means I don't need that much power. I think the most server load I've had on this blog so far is about 3 simultaneous requests, so I opted for small and quiet.

## The specs


* ASUS AT5NM10T-I mainboard with an Intel Atom D525 CPU
* Intel 320 Series 80 GB SSD
* 2 sticks of 2 GB  Kingston DDR3 RAM
* Corsair TX V2 650W PSU
* Lian Li PC-Q11B Mini-ITX tower


Now your two main responses might be: "an Atom processor for a server?", or the more likely "why the hell would you need a 650W PSU to power that measly thing?".

I had the same questions myself when I was looking for parts. The thing is that I really believe the Atom D525 which is a dual core 1.8GHz CPU will do the work at least as well as my old laptop with its 1.5 GHz Pentium M CPU. In fact, the CPU has been about the only part on my old laptop server that has never been a bottleneck. Node.js is not very CPU intense and my blog isn't a ray tracer churning out the latest Hollywood CG movie on each request (although that would be quite awesome).

The choice of power supply really boiled down to price/availability/quality. Low power PSUs in the 100-150W range (even that would be a little over the top for my build) are hard to find these days and the cost is almost the same anyways.

PSUs in the 300-450W range are mostly made by "unknown" suppliers or are of lower quality. I wanted a power supply that had good reviews and  won't fail me. And since my Lian Li case can support a full size ATX power supply I went with that.

## Expected outcome

Well I expect it to be quite a bit faster that my old server due to the SSD. I also expect it to draw much less power and it's almost guaranteed to be a lot less noisy under load.

Both the Lian Li chassi and the Corsair PSU come with 140mm fans which bodes well for low noise. My choice of Atom processor means that there are no other fans needed on this system since the Atom D525 is passively cooled by a nice big heat sink.

My old laptop server had a slow 4200 RPM hard drive (might be a 5400 RPM after it got changed a few years ago) which is SLOOOOOW to say the least. The Intel 320 Series might not be the fastest SSD in the world (in fact it's nowhere near that) but at 270 MB/s reads and 90 MB/s writes it should at least be a substantial performace upgrade and one less thing that makes noise.

The parts will likely arrive on Monday or Tuesday so I will probably lock myself in my office and start assembling right away. Until then I have to choose whether to stay with Ubuntu Server or move on to something new. The next LTS of Ubuntu is still a few months away and I really don't want to make any big upgrades on the server once it's up and running.

Stay tuned for more server stories in the coming week.
