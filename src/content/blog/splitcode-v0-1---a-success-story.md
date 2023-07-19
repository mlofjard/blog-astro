---
slug: "splitcode-v0-1---a-success-story"
title: "SplitCode v0.1 - A success story"
author: "Mikael Lofjärd"
dateTime: 2011-11-15T21:33:00+01:00
theme: "code"
tags: [
  "splitcode",
  "presenting"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Socket.io almost makes it to easy. Here's my early early alpha code. Works like a charm.

Server code (for node.js):

````js
var io = require("socket.io").listen(1338); 
io.sockets.on('connection', function (client) {
  client.on('codeChanged', function(code) {
    client.broadcast.emit('changeCode', code);
  });

  client.on('scrolled', function(position) {
    client.broadcast.emit('scroll', position);
  });
});
````

Master.html:

````html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SplitCode Master</title>
  <script src="socket.io.min.js"></script>
</head>
<body>
  <textarea id="mastertext" onKeyUp="maybesend();" wrap="off"></textarea>
  <script>
    var master = document.getElementById("mastertext");
    var socket = io.connect('192.168.0.15:1338');

    var th = {}; 
    function maybesend() {
      clearTimeout(th.timeout);	
      th.timeout = setTimeout(send, 100);
    }

    function send() {
      socket.emit('codeChanged', master.value);
    }
  </script>
</body>
</html>
````

Slave.html:

````html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SplitCode Slave</title>;
  <script src="socket.io.min.js"></script>
</head>
<body>;
  <textarea id="slavetext" wrap="off"></textarea>
  <script>;
    var slave = document.getElementById("slavetext");
    var socket = io.connect('192.168.0.15:1338');

    socket.on('changeCode', function (code) {
      slave.value = code;
    });
  </script>
</body>
</html>
````

Nevermind all the non compliant HTML or other code quality issues. The story here is that it is dead simple to use socket.io and it is blazingly fast.
