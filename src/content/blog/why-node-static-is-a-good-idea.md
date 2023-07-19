---
slug: "why-node-static-is-a-good-idea"
title: "Why node-static is a good idea"
author: "Mikael Lofjärd"
dateTime: 2011-11-22T22:40:57+01:00
theme: "code"
tags: [
  "nodejs",
  "architecture"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
If you are using node.js as a web server (as I am) and you want to serve up static files there are a lot of ways you can go about doing that. I'm going to talk about 3 of them.

## The bad path: Serving them yourself

It's really easy to do this for a proof of concept. Node.js has an easy to use `fs` library for reading and writing files to the file system. In order to serve up some HTML page you just parse the request URL, retrieve the file using `fs.readFile(...)` and then write the file to the response stream.

I did this for the small server I use at my Tuesday tutorials at work. The problem we faced last Tuesday was that our web site would not load properly in IE9 without resorting to "compatibility mode".

At the time I didn't have time to look into it (as I was tutoring) so I did it today instead, and I quickly figured out the problem. The same problem that would face anyone trying to write a web server in node using the `fs` library; MIME types.

There are a lot of MIME types involved when serving up a web page. HTML should be served as `text/html` and in our case encoded using `UTF-8`. CSS should be served as `text/css` and this turned out to be what broke our site in IE. And the images all have their own MIME type depending on whether they're JPGs, PNGs or GIF's etc, and they should be served as `binary`.

All in all, there's a lot of stuff to keep track of and while you could do all of that in code, why reinvent the wheel?

Another issue with the <code>fs</code> approach is that you have to implement your own caching.

## The good (or sometimes great) path: Using nginx

[nginx](http://nginx.org/) is a small, fast, http proxy/static file server/cache/load balancer that does an awesome job serving up static files with correct MIME types and great caching. The only current issue with nginx is that it only supports HTTP 1.0 and thus is incompatible with web sockets.

If you know that you're not going to use web sockets (or you're going to do some nifty port redirection) then nginx is the way to go.

## The best (for me) path: node-static

[node-static](https://github.com/cloudhead/node-static) is an awesome little node.js module and it's sole purpose is to serve up static files. It takes care of caching, E-tags, MIME types and all that stuff and it's really easy to use.

Some code from node-static's github page:

````js
var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(static.Server)('./public');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    //
    // Serve files!
    //
    file.serve(request, response);
  });
}).listen(8080);
````

Since I haven't decided on whether I want to use web sockets for anything on my blog yet, and I don't really have any performance issues that requires me to look more into nginx, I went down the node-static path and hasn't regretted it yet.

Now I just need to implement it into my Tuesday Web Track server. That will probably take me anywhere between 30 and 45 seconds. =)
