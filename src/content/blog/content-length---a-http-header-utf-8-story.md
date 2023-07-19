---
slug: "content-length---a-http-header-utf-8-story"
title: "Content-Length - A HTTP Header/UTF-8 Story"
author: "Mikael Lofjärd"
dateTime: 2012-01-27T15:01:31+01:00
theme: "code"
tags: [
  "nodejs",
  "http",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
The HTTP protocol has a lot of header fields that affects requests and responses. HTTP also have a couple of different request types (HEAD, GET, POST, PUT and DELETE). Unless you're building a <abbr title="Representational State Transfer">REST</abbr> service, you mostly have to deal with GET and POST on the web, and I don't even differentiate those as much as I should.

A couple of weeks ago, a thought occurred to me; "What happens when I make a HEAD request to my blog?". Well the answer turned out to be pretty simple. Node.js ignores any calls made to the <code>write</code> method of the response object if the request was a HEAD request.

That's all fine with me, but then I started thinking about what type of things should go into a HEAD response and if I could optimize anything. This lead me to look closer into the `Content-Length` header field.

The `Content-Length` header field describes the length of the content to come (well duh), in octets (8-bit bytes). In most scenarios there's really no need for it with the high speed internet connections of today, but there still exists a frontier where one might get a slow connection and could appreciate if the browser could reliably tell how much of the site is still to be loaded; mobile.

## The Unicode Problem

So I decided that I wanted my HTTP headers to have the `Content-Length` field in them. My template engine (Mustache) gives me the entire string to render to the response stream so I figured I could use the string length as my value for `Content-Lenght`. That turned out to be a erroneous assumption. All of my files and my database contains UTF-8 encoded data, as it should. The problem is that this means that string length is not equal to the byte length anymore since some characters (like the &auml; in my last name) is more than 8 bits long. 

A quick "google" later and it turns out that there isn't much native support in JavaScript for calculating the byte length of a UTF-8 string. Luckily for me, someone smarter had made a function that fit the bill (credits to Mike Samuel).

````js
function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}
````

## Updating the ViewManager

Now all I needed was to insert this into my `ViewManager.js` and now my responses include `Content-Length`.

````js
/*****************************************
 *   View Manager
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/

var ViewManager = (function () {

  var fs = require('fs');
  var path = require('path');
  var mu = require('mustache');

  var env = require('./environmentManager').EnvironmentManager;

  var templatesCached = false;
  var templates = {};
  var partials = {};

  function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  }

  return {

    init : function (templatePath) {

      if (!templatesCached) {
        console.log('ViewManager: Populating template cache');
        templates = {};
        var allTemplateFiles = fs.readdirSync(templatePath);

        for (var file in allTemplateFiles) {
          console.log(' - Adding ' + allTemplateFiles[file] + ' to template store');
          var filePath = path.resolve(templatePath, allTemplateFiles[file]);
          templates[allTemplateFiles[file]] = fs.readFileSync(filePath, 'utf-8');
        }
        partials.header = templates['header.partial.mu'];
        partials.footer = templates['footer.partial.mu'];

        templatesCached = true;
      }
    },

    renderView : function (response, viewName, model, contentType) {
      if (typeof(model.header) == 'undefined') {
        model.header = {};
      }

      contentType = contentType || 'text/html';

      model.header.trackingCode = env.trackingCode();
      model.footer = {};

      env.info('ViewManager: Rendering view ' + viewName);
      var html = mu.to_html(templates[viewName + '.mu'], model, partials);

      var contentLength = lengthInUtf8Bytes(html);

      var headers = {
        "Content-Type" : contentType + ';charset=utf-8',
        "Content-Length" : contentLength
      };

      response.writeHead(200, headers);
      response.write(html, 'utf-8');
      response.end();
      return;
    }
  };
    
}());

typeof(exports) != 'undefined' ? exports.ViewManager = ViewManager : null;
````

I'm planning on looking more into the different type of cache header fields sometime also, but for now I'm happy letting `node-static` take care of all the caching of my static content, and just not have any caching at all done on the dynamic content. After all, I've only got some 20 readers on this blog and I don't really "feel the pressure" yet.
