---
slug: "notes-from--oslash-redev"
title: "Notes from &Oslash;redev"
author: "Mikael Lofjärd"
dateTime: 2011-11-13T18:29:00+01:00
theme: "fun"
tags: [
  "oredev",
  "conference",
  "csharp",
  "nodejs",
  "web-design"
]
pictureUrl: "skeet.jpg"
pictureSubText: "Jon Skeet on Async in C# 5"
pictureAltText: "Jon Skeet"
draft: false
---
As you know, I went to the &Oslash;redev conference in Malm&ouml;, Sweden last week. It was a great conference and I saw a lot of great speakers talk on a lot of great topics.

The first two days of &Oslash;redev were "workshop" days. On monday we had a full day workshop with [Greg Young](http://codebetter.com/gregyoung/) teaching us the ins and outs of [CQRS](http://cqrs.wordpress.com/). The prerequisite to this workshop was a 6.5 hour long [video](http://cqrs.wordpress.com/video/). Between that and the 8 hour long workshop there was a lot of learning going on on the topic of CQRS, Event Sourcing and DDD in general. I always enjoy watching Greg speak because he's very passionate about everything he does and that always gets me going.

Tuesday was NServiceBus day. [Andreas &Ouml;hlund](http://andreasohlund.net/) talked about [NServiceBus](http://www.nservicebus.com/) and how it can be used to implement CQRS and Event Sourcing. It was nice to get an amount of repetition from the day before and get a different view on things. I find that things get rooted in my brain much better if I hear at least two different people explaining them.

Wednesday, Thursday and Friday were when most of the attendees showed up and all the little 50 min lectures got started. There were several different tracks to go to and about 6 lectures each day plus the opening and ending keynote.

Here are some of my favourites:

[Jon Skeet](http://msmvps.com/blogs/jon_skeet/) held a talk about the new `async` and `await` keywords in C# 5. True to his nature as a self-proclaimed C# enthusiast he also went ahead and explained how it all worked inside the MSIL compiled code.

Directly after that on the .Net track, [Gary Short](http://garyshortblog.wordpress.com/) held a very useful talk on collection classes in C#. I work in C# every day, and I must admit, I knew there were advantages to using different collection classes for different things but I never felt the need to sort out which one to use. Gary tried to explain the pros and cons of as many classes as possible in his 50 minute lecture, but he did a great job and I really felt like I had learned something afterwards.


[Phil Haack](http://haacked.com/) held a talk on mobile web applications, which apart from the stuff coming in ASP.Net MVC 4 was pretty much what I wrote about [two weeks ago](http://lofjard.se/post/responsive-web-design). Still, he was a funny guy and I enjoyed his talk.

In the last session of the day I took some of my co-workers to see [Felix Geisend&ouml;rfer](http://twitter.com/#!/felixge) give a talk on node.js. His blog at [debuggable.com](http://debuggable.com/blog) was of great use to me when I started playing with node.js and I felt that someone needed to educate my co-workers on the matter. For some reason they stop listening as soon as I get to the "Server side javascript" part.

Thursday begun with an awesome keynote presentation by [Dan North](http://dannorth.net) called "Embracing Uncertainty". If you ever get a chance to see it, don't miss it. Gojko Adzic has a great write up of the keynote [here](http://gojko.net/2011/11/10/dan-north-at-oredev-embrace-uncertainty/).

The rest of the day I mostly indulged myself on the UX track where I went to two great talks by [Robby Ingebretsen](http://nerdplusart.com) on "Digital Typography" and "Design composition for developers". Robby was a great speaker. He used lots of examples and shared a lot of great tips and tools that I, as an aspiring designer, found extremely useful.

Unfortunatly we went home on Thursday evening which means that I didn't go to any lectures on Friday. Instead I slept through half that day and in the afternoon I started working on the database backend for the blog.
