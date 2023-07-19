---
slug: "the-power-of-commonjs"
title: "The power of CommonJS"
author: "Mikael Lofjärd"
dateTime: 2011-11-16T23:44:00+01:00
theme: "code"
tags: [
  "javascript",
  "nodejs",
  "commonjs"
]
pictureUrl: "commonjs.png"
pictureSubText: "The CommonJS logo"
pictureAltText: "CommonJS logo"
draft: false
---
A few days ago when I was putting my posts into CouchDB, instead of relying on a static HTML file, I also implemented templating with [Mustache](http://mustache.github.com/). Mustache is small, easy to use and has almost no advanced features. It's power lies in the vast amount of implementations it has for different platforms but most of the power comes from one single implementation; the JavaScript implementation.

There's nothing really special about the JavaScript implementation except that it is written in JavaScript and is intended to run in the web browser. The implication of having this implementation however is that you can now use the same template files on both the server side and client side. That was a big win for me so I decided to use it.

There is also, on [their website](http://mustache.github.com/), a link to a node.js implementation, and that's what I was planning to use on my server.

After a few minutes of trying to put it to work I gave up. But then I figured; "Hey, I'm writing JavaScript in node.js. Why don't I just set up the client-side Mustache implementation as a node module?".

So node.js, as you might know, is an implementation of the [CommonJS](http://www.commonjs.org) API. CommonJS defines a really simple way of turning your JavaScript files into modules for use in any CommonJS implementation.

````js
exports.to_html = to_html;
````

This single line was all I needed to add to the JavaScript file I used on the client. I could do some error checking too see if `exports` is defined, if I wanted to, and that would give me a way of using the exact same file on both the client and the server. However, I decided to hade two files since I wanted to put the node module with my global node modules for use in other projects.

## Taking it to the next level

Today I decided that I wanted to try and do the same thing with the [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/) library.   That turned out to be a little trickier.

When Alex wrote version 3.x of SyntaxHighlighter he, wisely, decided that it should be a CommonJS module. He even wrote a test that uses it in node.js. The problem with his implementation lies in what features he exposed.

When you run SyntaxHighlighter in a browser, you make a call to a function that gets all HTML-elements containing code (by default the `<pre>`-elements). Then it gets their `innerHTML` attribute and does its magic with it. When it's done it replaces the `<pre>`-element with the new pretty `<div>`-element containing all the highlighted code.

This doesn't work so well on the server since it uses DOM-manipulation and the server side has no DOM (although some people are trying to build DOM access as a node module but that feels dirty to me).

What Alex did was expose a function that renders a string containg the code into a string containing the pretty `<div>`-element. Like this (from his website):

````js
var sys = require('sys'),
  shSyntaxHighlighter = require('shCore').SyntaxHighlighter,
  shJScript = require('shBrushJScript').Brush,
  code = '\
    function helloWorld()\
    {\
      // this is great!\
      for(var i = 0; i <= 1; i++)\
        alert("yay");\
    }\
  ',
  brush = new shJScript();
 
brush.init({ toolbar: false });
sys.puts(brush.getHtml(code));
````

That's great if you have a lot of code examples in a database that. I however have all my code examples embedded in blog posts, surrounded by a lot of text and HTML. I want it to work in the same way as it does client-side.

So I hacked it. It's not pretty, it still contains a lot of code that I don't need and it involves a bit of [XRegExp](http://xregexp.com/) magic (XRegExp is awesome btw).

What it does do is work, beautifully. And now I can do this:

````js
var sh = require('./shCore').SyntaxHighlighter;

// requiring brushes loads them into the sh-object somehow
var bashBrush = require('./shBrushBash').Brush;
var csharpBrush = require('./shBrushCSharp').Brush;
var cssBrush = require('./shBrushCss').Brush;
var jsBrush = require('./shBrushJScript').Brush;
var xmlBrush = require('./shBrushXml').Brush;

//----- I cut out the fetching blog post stuff from here -----//

// apply syntax highlighting
blogpost.htmlContent = sh.highlight(blogpost.htmlContent);
		
// apply template
var html = mu.to_html(templates['blogpost.mu'], blogpost);

// write it back to the response stream
response.writeHead(200, { "Content-Type" : "text/html" });
response.end(html);
return;
````

It also saves my readers from having to download 166 KB worth of data distributed over six HTTP requests, and that, ladies and gentlemen, is a win.
