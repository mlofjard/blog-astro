---
slug: "somewhat-backwards-compatible"
title: "Somewhat backwards compatible"
author: "Mikael Lofjärd"
dateTime: 2011-11-14T17:55:00+01:00
theme: "code"
tags: [
  "web-design",
  "html",
  "css",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I got the chance to see my blog through the eyes of Internet Explorer 8 today, and boy was that something to behold. There was no styling what so ever. It looked like the internet pre 1995.

This site uses HTML5 and CSS3 and that is fine for most modern web browsers. Even those that has no support for HTML5 renders ok, mostly due to the fact that they ignore the tags they dont recognize and just renders them as they would any `<div>`-tag. But not dear Internet Explorer. Internet Explorer < 9 just ignores the tags and doesn't style what it doesn't know. Awesome!

Good thing then that a couple of guys realized that you could trick IE into rendering unknown tags by creating them with javascript.

````js
document.createElement("mysuperspecialtag");
````

The above piece of javascript is all that is required for IE to accept all `<mysuperspecial>`-tags and style them with CSS.

Thankfully they built a little script that does this (and a bit more) for all the new HTML5-elements.

````html
<!--[if lt IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
````

Include the above in the head of your HTML document and you're good to go.

Now this just solves the IE problem. The default in HTML5 is to render most of the new elements as blocks. But the older browsers don't necessarily do this so it's considered best to do this implicitly in your CSS file.

````css
header, nav, hgroup, section, article, footer, address {
	display: block;
}
````

The above are not all of the new HTML5 elements but you can add whatever else you use on your site.

DISCLAIMER: I'm at home right now with nothing but the latest and greatest browsers at hand so I can't check that my changes actually worked, but at least I'll get to look at it with IE 8 again tomorrow.
