---
slug: "trying-to-fix-syntaxhighlighter-on-mobile-browsers"
title: "Trying to fix SyntaxHighlighter on mobile browsers"
author: "Mikael Lofjärd"
dateTime: 2011-11-04T11:44:00+01:00
theme: "code"
tags: [
  "blog",
  "html",
  "css",
  "web-design"
]
pictureUrl: "inconsolata.png"
pictureSubText: "The Inconsolata font by <a href=\"http://www.levien.com/type/myfonts/inconsolata.html\">Raph Levien</a>."
pictureAltText: "Inconsolata font"
draft: false
---
I recently incorporated the [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/) by Alex Gorbatchev so that I can easily show code examples in a nice way.  
The default configuration seems to have a few quirks when it comes to working on mobile devices. Not all of them are SyntaxHighlighters fault to be fair, but here's some of the things I've had to deel with.

#### Broken font fallback stack

The default font fallback stack in SyntaxHighlighter looks like this:

````css
font-family: "Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace !important;
````

Consolas is the new pretty font used in Visual Studio 2010 and it is my personal favourite for displaying source code, but it only exists on Windows Vista+. Well that shouldn't be a problem since there is a big fallback stack defined and it ends with "monospace" witch means "any monospace font on the device".

However, Android 2.x has a broken implementation of the fallback mechanism causing it to try "Consolas", fail (since it doesn't exist on Android) and then, instead of trying the next font in line, it just automatically selects "sans-serif". Now I don't now about you but I feel that sans-serif fonts have no business beeing around source code (unless they are a monospace sans-serif).

On top of this it seemed that none of my font-size tags had any effect on this sans-serif so the line numbers and lines of code didn't align properly.  
The problem got even worse on the iPhone witch successfully falled back on a monospace font but made the code lines much larger than the line numbers causing the alignment to be of by a factor of approx. 1.4.

#### Web fonts to the rescue

Web fonts have been around for a long time, but like the `<video>` element in HTML5, all browsers support a different font format.

The folks over at [Fontspring](http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax) have done a tremendous job putting together a "bulletproof" syntax for the `@font-face` css attribute that works on all current (and a lot of older) browsers.

This made me think of just putting "Consolas" on my server and making all the browsers download it and then use it as my first font in the fallback stack for SyntaxHighlighter. But "Consolas" is a proprietary font and thus that would have been illegal.

There is however a beautiful, free alternative to "Consolas" called "Iconsolata" made by [Raph Levien](http://www.levien.com/type/myfonts/inconsolata.html) so I decided to use that.

Since I didn't feel like I hade the time to mess around with all the neccesary MIME-types in my Apache-configuration I decided to use the [Google Web Fonts API](http://code.google.com/apis/webfonts/) which as it turned out already hosted the "Inconsolata" font. Great!

An additional line of CSS included on my site...

````html
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Inconsolata" />
````

...and a quick add to the font fallback stack of SyntaxHighlighter...

````css
font-family: "Inconsolata", "Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace !important;
````

...and now it works! Or so I thought.

#### The iPhone problem

While this fixed the font problem on my Android phone, the lines are still missaligned on my iPhone. It's was now only missaligned by a factor of approx. 1.1 but it is still enough for me to get disturbed by it.

````css
-webkit-text-size-adjust: 100%;
````

I added the above rule to the SyntaxHighlighter CSS file and now it renders beautifully in all of my devices.  
The iPhone and my Android tablet even manages to get the scrolling correct for the code examples but my Android phone doesn't. Well I guess you can't have everything.
