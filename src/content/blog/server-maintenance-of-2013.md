---
slug: "server-maintenance-of-2013"
title: "Server Maintenance of 2013"
author: "Mikael Lofjärd"
dateTime: 2013-08-18T12:42:14+02:00
theme: "life"
tags: [
  "misc",
  "hardware",
  "server"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
My server mostly keeps to itself, chugging along in my apartment storage space, but sometimes I order new parts for it. One such part was the picoPSU I bought several months ago to replace my totally overkill 650W PSU.

Essentially, I wanted to replace this:

![Really big PSU](/img/upload/36848b40-cda9-4d89-b43b-7bc008126874.jpg)

with this:

![Really tiny PSU](/img/upload/80e008fd-c6cf-4dc2-a8be-dc9bb1eea0ac.jpg)

The Corsair TX-650 has worked without a hitch, but my server is an Atom D525 with a TDP of 12W and its only other hardware is an SSD. It seems like there would be some serious loss of power due to PSU inefficiencies on such small loads.

The picoPSU on the other hand is a DC-DC PSU with an external brick rated for 120W loads, and it has proven much more efficient on smaller loads in test around the interwebs.

When I finally took the time to switch to the picoPSU, I also got rid of one of the large fans humming along inside the server case. The expected silence was however interrupted  by the screeching sound emanating from the Lian-Li case fan installed in my server case. Since this was now the only fan in the case (and the motherboard chipset was getting a bit hot for my taste without any fan at all) I decided to replace it with something a bit quieter.

The choice fell on this:

![REALLY quiet fan](/img/upload/64e9a94b-ec1b-47f4-a613-625387ed095d.jpg)

This is the Noctua NF-A14 ULN (Ultra Low Noise) 140mm. In the configuration I chose it runs at 650 RPM and it is barely audible from a distance of about one inch. Move another inch or two away from the fan and you need to have a seriously quiet room if you're going to hear anything from this fan.  
More than once I had too look at the fan to make sure that it was really spinning.

The next time I'm upgrading my server I'm going to purchase some kind of power meter to see how many watts my little machine is operating on but for now I'm just happy that it's operating a little (a lot) quieter.
