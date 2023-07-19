---
slug: "client-certificates-on-android"
title: "Client Certificates on Android"
author: "Mikael Lofjärd"
dateTime: 2011-11-18T20:25:00+01:00
theme: "code"
tags: [
  "android",
  "ssl"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Today I stayed at home with a seriously soar throat and a mild but annoying headache. Unable to sleep through the day I set upon myself the task of creating an administration interface for the blog.

One of the reasons I had for building my own blog engine was to make it easy for me to post from my Android tablet. It's been pretty easy to write new posts on my computer at home using the CouchDB administration interface, but I don't want that exposed to the Internet.

I thought for a while about building a classic username/password login with sessions and all the usual stuff but to do that I wanted to have it transfer credentials over HTTPS. That meant creating SSL keys and self-signing a certificate. No problem there since my server runs Linux and all. But when reading up on TLS/SSL and server certificates I drifted into the client certificate jungle and realized that what I really wanted was for me to be able to post blogs without the use of a username and password.

Node.js has a great API for making use of client certificates:

````js
var https = require("https");
var fs = require("fs");

function onRequest(request, response) {
  response.writeHead(200);
  response.end("Authorized : " + request.connection.authorized);
}

var options = {
  key: fs.readFileSync('certs/server.key'),	// server key
  cert: fs.readFileSync('certs/lofjard.crt'),	// server certificate
  ca: fs.readFileSync('certs/lofjard.crt'),	// client certificate (or CA)
  requestCert: true
}

https.createServer(options, onRequest).listen(443);
````

The problem that annoyed me for hours is the fact that Android does NOT support client certificates. In fact there's a whole lot of things Android doesn't do when it comes to certificates.

I even went so far as to extract the default CA certificate key store from my rooted HTC Desire, editing it with a little java program I found in a dark corner of the Internet and then booting my phone into recovery mode, remounting a few partitions, moving some files around and then rebooting it again, only to find out that it had no effect.

Apparently Android 4.0 is going to solve all this (and world hunger) but for now I'm stuck either writing on my iPhone or write in Evernote on my tablet, sync to Evernote on my iPhone and then upload it. Ice Cream Sandwich could not come any sooner if you ask me. :) 
