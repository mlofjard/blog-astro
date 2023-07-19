---
slug: "cache-me-if-you-can"
title: "Cache Me If You Can"
author: "Mikael Lofjärd"
dateTime: 2012-03-06T23:30:31+01:00
theme: "code"
tags: [
  "nodejs",
  "blog",
  "hardware",
  "server",
  "cache"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Today at work was "do-anything-but-work-day". It's a bit like Googles 20%, but instead of 20% it's more like <del>.0001%</del> <ins>.8%</ins> or something like that. It's was our first time and not that many people had a clear idea about what to do at first. I on the other hand had a mission all planned out.

#### The Performance Degradation

When I put the blog on the new server back in January, I noticed a [small decrease](http://lofjard.se/post/say-welcome-to-ibs) in performance. After a few tests I've realized that the CPU is the culprit.

The Atom D525, while dual-core, at 1.6 GHz has roughly half the computational power of the Pentium M at 1.5 GHz, which was what my old server had under the hood. 

Node.js can make use to multi-core processors by starting more instances of itself, which made concurrent connections on the new server almost the same speed as on the old server. However, concurrent connections isn't really my problem since I only have around 30 readers on a good day.

#### What's Taking You So Long?

Well even in the old version of the blog, I do a lot of caching. My `node-static` instance takes care of all static file handling and it does a really good job of caching them. I also cache all of my `mustache` templates when I start Node.js so I can read them from memory every time I render a page.

What was taking so long was actually more than one thing.

First there was database access. `CouchDB` is really fast and caches a lot, but its only way of communicating is REST over HTTP so there's still some overhead getting to those cached results.

And then there was presentation logic. The actual rendering of the data on to the template takes a few milliseconds and all pages with source code on them take a few milliseconds more to render all the [syntax highlighting server-side](http://lofjard.se/post/the-power-of-commonjs). Sometimes there's a lot of RegExp running to make it all happen.

#### The Mission

This brings us back to today and my mission; to build an in memory cache for caching web server responses.

My plan was to build a cache that stored the entire HTTP response (headers and content) and that I could clear selectively when needed. This lead me to remove my multi-core code and run Node.js as a single process, since otherwise I would have been in another world of hurt trying to get my processes to sync there cache stores.

When a new post is added I want to clear most of the cache (list pages, archive, atomfeed etc) but not the post pages, and when a comment is added to a post I just want to clear the list pages and the post page for that post. So I added a few different cache stores that I could clear out as I wanted to.

Most of this is handled by the CacheManager.

````js
/*****************************************
 *   Cache Manager
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/
 
var CacheManager = (function () {

  var fs = require('fs');

  var env = require('./environmentManager').EnvironmentManager;
  var misc = require('./misc').Misc;

  var cacheStore = {};

  function getStoreType(url)
  {
    var urlParts = url.split('/');
    var result = 'dynamic';

    switch (urlParts[1]) {
      case 'source':
      case 'about':
        result = 'static';
        break;
      case 'archive':
      case 'atomfeed':
        result = 'semiStatic';
        break;
      case 'tags':
      case 'tag':
        result = 'semiDynamic';
        break;
      case 'post':
        result = 'floating';
        break;
    }

    return result;
  }

  return {

    init: function () {
      cacheStore = {};
      cacheStore.static = {};         // static between boots       - /source /about
      cacheStore.semiStatic = {};     // clear on new post          - /archive /atomfeed
      cacheStore.semiDynamic = {};    // clear on edit post         - /tags /tag
      cacheStore.dynamic = {};        // clear on comment (default) - / /page
      cacheStore.floating = {};       // null item on comment       - /post
    },

    clearOnNewPost: function () {
      env.info('CacheManager: Clearing cache on new post');
      cacheStore.semiStatic = {};
      cacheStore.semiDynamic = {};
      cacheStore.dynamic = {};
    },

    clearOnEditPost: function (url) {
      env.info('CacheManager: Clearing cache on edit for ' + url);
      cacheStore.semiDynamic = {};
      cacheStore.dynamic = {};

      delete(cacheStore[getStoreType(url)][url]);
    },

    clearOnNewComment: function (url) {
      env.info('CacheManager: Clearing cache on comment for ' + url);
      cacheStore.dynamic = {};
      delete(cacheStore[getStoreType(url)][url]);
    },

    cache: function (url, headerData, contentData) {
      env.info('CacheManager: Caching content for ' + url);
      cacheStore[getStoreType(url)][url] = { content: contentData, headers: headerData };
    },

    fetch: function (url) {
      var data = cacheStore[getStoreType(url)][url];

      if (typeof(data) != 'undefined') {
        env.info('CacheManager: Found cached entry for ' + url);
        return data;
      }

      return null;
    }
  };
 
}());
 
typeof(exports) != 'undefined' ? exports.CacheManager = CacheManager : null;
````

#### Hooking It Up

Previously my main workflow looked something like this; The Router looked at the request, called the assigned Controller which fetched data, formed the data into a model and passed the model to the ViewManager which rendered the result to the response stream.

Hooking up the CacheManager meant that I had to get some parts a little "dirtier" than I wanted, but instead of putting a lot of code into the ViewManager, I created the ResponseManager.

````js
/*****************************************
 *   Response Manager
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/
 
var ResponseManager = (function () {

  var env = require('./environmentManager').EnvironmentManager;
  var cm = require('./cacheManager').CacheManager;

  var misc = require('./misc').Misc;

  return {

    writeCachedResponse : function (response, cachedUrl) {
      env.info('ResponseManager: Writing cached view for ' + cachedUrl);

      var data = cm.fetch(cachedUrl);

      response.writeHead(200, data.headers);
      response.write(data.content, 'utf-8');
      response.end();
      return;
    },

    writeResponse : function (request, response, responseData, doNotCache) {
      var pathName = misc.getPathName(request.url);

      if (typeof(doNotCache) == 'undefined') {
        cm.cache(pathName, responseData.headers, responseData.content)
      }

      response.writeHead(200, responseData.headers);
      response.write(responseData.content, 'utf-8');
      response.end();
      return;
    }
  };
     
}());
 
typeof(exports) != 'undefined' ? exports.ResponseManager = ResponseManager : null;
````

The ResponseManager does most of the talking with the CacheManager and I remade the ViewManager so that the <code>renderView()</code> method now returns the rendered response instead of writing it to the response stream. This lets the Controllers do the job of rendering through the ViewManager and then passing the result to the ResponseManager.

The other part of the equation is the Router. I didn't really want to put CacheManager calls into the router but it is the first place that has a good path to use as key, so for now the Router checks for the existence of a cached response and, if found, sends it to the ResponseManager before even starting to look up what Controller to call if no cached response is found.

#### Show Me The Money

So what kind of a performance boost are we talking about?

Well, using the handy `ab` (Apache Benchmark) I sent a thousand requests to my different implementations:

#### Uncached

Requests per second: 5.41 (mean)  
Time per request: 184.761 ms (mean)  
Transfer rate: 177.92 Kbytes/sec recieved

#### Cached

Requests per second: 62.86 (mean)  
Time per request: 15.910 ms (mean)  
Transfer rate: 2097.06 Kbytes/sec recieved

That's quite some increase in performance. So much, in fact, that the transfer rate exceeds my measly 10 Mbit/s outgoing fiber connection. At least now, if my blog was to slow down I know it's not the servers fault.

Just for kicks I benchmarked it running on my laptop with a Core 2 Duo at 2.0 GHz and the results point to some possible areas of improvement for Intel on the Atom line (mainly memory access speed):

#### Cached (on my workstation)

Requests per second: 213.98 (mean)  
Time per request: 4.673 ms (mean)  
Transfer rate: 7030.95 Kbytes/sec recieved

Luckily I don't have enough traffic to warrant an upgrade to my fiber connection. 100/100 Mbit/s costs almost twice as much as my 100/10 Mbit/s.
