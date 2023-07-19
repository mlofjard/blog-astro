---
slug: "client-side-javascript-initialization"
title: "Client-side JavaScript Initialization"
author: "Mikael Lofjärd"
dateTime: 2011-12-07T22:37:27+01:00
theme: "code"
tags: [
  "javascript",
  "blog",
  "architecture",
  "web-design"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Yesterday I started using the [BundleController](http://lofjard.se/post/automatic-minification-and-bundling-with-nodejs) with my JavaScript files on the client-side. I also deployed my [ViewManager](http://lofjard.se/post/handling-views-in-nodejs) so that all my views now uses the bundled and minified JavaScript file produced when I start (or restart) my Node.js server.

This meant that all my JavaScript was being run on every page in the blog, and while it isn't that much JavaScript yet I still wanted to improve on it.

I decided to make use of some closure magic and built something like this:

````js
if (typeof(BlogPageFunctions) == 'undefined') {
  BlogPageFunctions = {};
}

BlogPageFunctions.admin = function () {

  // query some objects with jQuery here,
  // bind up some events etc.
  ...

}
````

I use the above pattern on all my page specific JavaScript code. For now, this amounts to two functions living on the `BlogPageFunctions` object, `admin` and `comments`. I made these regular functions instead of <abbr title="Immediatly-Invoked Function Expression">IIFE</abbr>s because I only want them to run on their respective pages.

So how do I make them load? I could of course just written some script code into the template itself, but that would have created a lot of copy-and-paste code since it would have to include jQuery's if-document-ready-stuff on every page and I wanted to keep the intrusion of JavaScript inside my templates as minimal as possible.

If you remember my BundleController it had a sorting function in it that was used to prioritize certain JavaScript and CSS files so that they would load before others. I used that to make sure that if I have a JavaScript file named `init.js` then I would add it AFTER all my other files in the bundle.

Inside `init.js` is where I execute the initialization code for each page:

````js
$(document).ready(function () {

  if (typeof(BlogPageMetaData) != 'undefined') {
    for (var i in BlogPageMetaData.init) {
      BlogPageFunctions[BlogPageMetaData.init[i]]();
    }
  }

});
````

But what's this `BlogPageMetaData` thing you ask? That's what I put into my templates for the pages that need some kind of JavaScript on them. This code is from the top of my admin page template:

````html
{{>header}}
  <script>
    if (typeof(BlogPageMetaData) == 'undefined') {
      var BlogPageMetaData = {};
    }
    BlogPageMetaData.init = ['admin'];
  </script>
  <section class="admin">
  ...
````

I create a `BlogPageMetaData` object (if it doesn't exist already for some reason) in the global scope and then I add an array of function names for `init.js` to call when the page has finished loading.

This way I get the best of two worlds; I get to have ONE JavaScript file that is cachable by the browser, and I don't run unnecessary JavaScript code on pages that doesn't need it.
