---
slug: "coding-on-stage"
title: "Coding on stage"
author: "Mikael Lofjärd"
dateTime: 2011-11-15T18:38:00+01:00
theme: "life"
tags: [
  "presenting",
  "splitcode"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I held a tutorial on HTML5 today at work and my preparations led me to think about coding while doing a presentation. This was done a lot at &Oslash;redev, but everyone did it in the same two ways. Either you duplicate your screen and let your attendees see everything that goes on on your desktop, or you extend your desktop, keeping your notes on the computer screen and your code on the projector.

The problem with the first option is that you need to have your notes on paper. The problem with the second option is the strain it puts on your neck when you have to look at the projector while coding and at the same time facing the attendees.

What I wanted was a window on my desktop that I could write code in and another window on the extended projector screen that would show the code in realtime while I was typing it.

"To the google-mobile batman!"  
As usual someone has already done it, but only on Mac.

I'm a Windows person most days so that wouldn't work for me. I decided to write my own. The first prototype, which I used today with some success, was a web page with two big textarea-elements which I dragged out across both screens. I wrote in the one on my computer screen and it replicated the text on the other textarea on the projector. It worked but it wasn't pretty.

## Enter node.js and socket.io

This is what I will try tonight: a kind of server/master/slave solution with socket.io/node.js on the server side and html/socket.io in the clients. This will allow me to have separate windows and even separate computers if I want to.

Stay tuned for my failure/success story tomorrow.
