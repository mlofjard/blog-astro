---
slug: "wifi-channel-13-and-android-2-x"
title: "WiFi Channel 13 and Android 2.x"
author: "Mikael Lofjärd"
dateTime: 2011-11-18T21:07:00+01:00
theme: "life"
tags: [
  "android",
  "wifi"
]
pictureUrl: "inssider.png"
pictureSubText: "inSSIDer Wi-Fi analyzer"
pictureAltText: "inSSIDer"
draft: false
---
A friend of mine told me about how a program called [inSSIDer](http://www.metageek.net/products/inssider/) helped him get better performance from his wireless network at home. A few days ago I decided to try it out. 

inSSIDer is this nifty little profiling tool that allows you to see visually all the wireless networks in your vicinity, what their signal strengths are and what channels they're occupying.

It turns out I have a 14(!) networks interfering with mine. The best way to minimize interference is of course to use another channel. The problem is that 802.11g/n networks use approx. 20 MHz of bandwith and the 13 channels allowed (only 11 in the States/Canada) are spaced only 5 MHz apart.

802.11b networks used approx. 30 MHz of bandwidth which in turn made room for only 3 non-overlapping channels in the spectrum (1, 6 and 11). There aren't that many 802.11b devices left nowadays so in reality we could have 4 non-overlapping channels in europe (1, 5, 9 and 13) but all networking hardware is made in Asia and made for the world market so most wireless routers come with a default to channel 1, 6  or 11.

This turned out to be the case in my neighbourhood to. 4 networks fought over channel 1, 8 networks (including mine) fought over channel 6 and one luncky bastard had channel 11 all to himself. I decided to use channel 13 since it had the least amount of overlap with anyone.

Now normally all your devices just switch to the new channel automatically, but for some reason my Android phone couldn't find my network anymore.

A quick google lookup the next day led me a "hidden" settings menu.  
`Settings -> Wireless & network settings -> Wi-Fi settings -> Press menu-button -> Advanced -> Regulatory domain -> 13 channels`

I don't know if it was set to 11 channels for international compliance or if it was my CyanogenMod 7.1 installation that set it to 11 channels by default, but now it works like a charm on channel 13.
