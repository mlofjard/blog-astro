---
slug: "node-tcp-client"
title: "Node TCP Client"
author: "Mikael Lofjärd"
dateTime: 2011-11-22T01:38:53+01:00
theme: "code"
tags: [
  "nodejs",
  "home-automation",
  "gadgets",
  "tcp"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
A few weeks ago I bought an [iTach IP2IR](http://www.globalcache.com/products/itach/ip2irspecs/) from a company called Global Caché. Combined with an iPhone app called iRule it lets me use my iPhone to control my home theater equipment.

This has been an awesome experience. No more fighting over remotes since my wife has the same app on her phone, and when our daughter wakes up on the weekends we can turn the TV on in the living room without leaving the bed and thus buy our selfs a couple of minutes more snooze time.

The thing that makes Global Caché more awesome than most hardware companies is that they publish their API specs on their web site, and it's a really nice, simple ASCII based TCP API. The API is really what made me choose this product over similar options.

Since the API works over TCP I can connect with almost anything that has a network connection and an SDK. Today I chose to connect with node.js and create a little program that is both a TCP client and a WebSockets server. My client in this case was a simple HTML page with a button that sent a message over WebSockets, similar to what I did with [SplitCode](http://lofjard.se/post/splitcode-v01-a-success-story).

Here's the whole source code:

````js
var io = require("socket.io").listen(1338);
var net = require('net');

io.sockets.on('connection', function (client) {
  console.log('WS: client connected');

  client.on('togglePower', function(code) {
    console.log('WS: recieved togglePower command');

    togglePower();
  });
});

var tcpclient = net.connect(4998, '192.168.0.16', function() {
  console.log('TCP: client connected');
});

tcpclient.on('data', function(data) {
  console.log('TCP: recieved ' + data.toString());
});

tcpclient.on('end', function() {
  console.log('TCP: client disconnected');
});

function togglePower() {
  tcpclient.write('sendir,1:1,1,36023,1,1,325,161,21,61,21,61,21,61,21,61,21,20,21,20,21,20,21,20,21,20,21,60,21,61,21,20,21,20,21,20,21,20,21,60,21,20,21,60,21,20,21,20,21,60,21,20,21,20,21,20,21,60,21,20,21,60,21,61,21,20,21,60,21,61,21,61,21,1550,324,81,21,3602\r\n');
}
````

My iTach is on ip `192.168.0.16` and all communication is handled on port `4998`.

I now have a button that can turn my IPTV STB on and off. It's not much but it only took me all but 5 minutes to put together. =)
