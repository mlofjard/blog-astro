---
slug: "experimental-server-is-up"
title: "Experimental server is up"
author: "Mikael Lofjärd"
dateTime: 2011-11-04T21:52:00+01:00
theme: "code"
tags: [
  "nodejs",
  "blog"
]
pictureUrl: "node.png"
pictureSubText: "Some of the code behind."
pictureAltText: "Node server code"
draft: false
---
I've put up a node test server running on port 1337 (it was already forwarded to my server for reasons forgotten by me) and I configured [node-static](https://github.com/cloudhead/node-static) to take care of all my static files.

If you want give it a go, head to http://www.lofjard.se:1337 (EDIT: not available anymore) and have a look at an exact copy of this site running on another web server.

Setting up node-static turned out to be pretty simple. Example stolen from node-static's GitHub page:

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

Since this blog is currently all static files there's not really all that much to my node code but I wanted to get a feel for how it holds up.

I also installed [supervisor](https://github.com/isaacs/node-supervisor) so that the server gets restarted should it crash.

Supervisor also has the nifty ability to monitor changes to your files so that it can automatically restart node when updates are made to the server code. Very handy in the development phase.
