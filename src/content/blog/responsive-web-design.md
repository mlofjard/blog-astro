---
slug: "responsive-web-design"
title: "Responsive Web Design"
author: "Mikael Lofjärd"
dateTime: 2011-11-03T22:16:00+01:00
theme: "code"
tags: [
  "blog",
  "html",
  "css",
  "web-design"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Responsive web design is the new rage in HTML. As much as I dislike buzzwords, this one is actually something worth thinking about.  
[Scott Hanselman](http://www.hanselman.com/blog/LearningAboutProgressiveEnhancementSupportingMobileBrowsersWithCSS3MediaQueries.aspx) wrote a blog post on the subject a while back and [James Fuller](http://www.jblotus.com/2011/06/21/protect-your-career-with-these-5-web-development-technologies/) has it at #5 on his top 5 list of things you need to learn right now.

If you don't have a smartphone of your own to try your site out on you can make use of Google's [GoMo](http://www.howtogomo.com/en/#test-your-site) project which can render what your site will look like on an Android phone.

As of this post I've done my share of responsive web design for this site so if you're watching this on your phone or tablet thinking "wow, this works really nice" then you know why.

Here's what I did:

````css
@media all and (max-width: 720px) {
  body {
    padding: 0 10px 0 10px;
  }

  .postpic, .fotoholder {
    max-width: 200px;
  }
}

@media all and (max-width: 480px) {
  body {
    padding: 0 2px 0 2px;
  }
	
  .postpic, .fotoholder {
    max-width: 150px;
  }
	
  body > header aside.links, section.blogposts div.ads {
    display: none;
  }
}
````

When the screen size decreases I make my "padding" smaller and I also decrease the maximum width allowed for my pictures. In the smallest version (less than 480 pixels wide) I also hide the "link bubble" in the header, leaving just the title and my smug face, and also hide the ads since they are about 460 px wide.

I also added a meta tag that makes sure the site is always rendered at the correct resolution for the device that views it. Mobile browsers on smartphones and tablets by default render the content using a much greater width and then scales down the site for backward compatibility with non-mobile-optimized sites.

My recently added syntax highlighter does seem to have some problems when rendered on phones with lower resolution but that is a problem for another day.

````html
<meta name="viewport" content="user-scalable=no, width=device-width" />
````
