---
slug: "node-js-development-server-strategy"
title: "Node.js Development Server Strategy"
author: "Mikael Lofjärd"
dateTime: 2011-11-24T18:28:37+01:00
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
When I started building this blog my server was the production environment and my laptop was the development environment. This all changed when I added the database and started doing more UNIX specific stuff such as path resolving and such. So from then until yesterday my production environment was also my development environment. Not the best strategy I admit.

Yesterday when I rewrote the architecture I also decided that I needed to set up a separate node.js instance as a development environment on the server.

The first problem I had to solve was configuration. My configuration was scattered all over the code base so I moved it all into `index.js` which is the file I execute with node when I start the server.

I also did not want to have to change my configuration before I deploy (copy) from development to production, thus my code somehow needed to be aware of whether it was production code or development code.

## Moving files around

Node.js has a global `process` object that holds information about the running node.js process. In the API for `process` is a method called `cwd()` that stands for Current Working Directory. It's default value is the folder from where you called node.js when you started it.

Based on this I made my file structure as such:

* /dev
* /dev/content
* /dev/controllers
* /dev/views
* /stable
* /stable/content
* /stable/controllers
* /stable/views

There are a few other folders but these are the important ones.

The `/dev` and `/stable` folders are where my main code resides and where I execute node.js from. In the underlying `/content` folders, all of my CSS, images and client JavaScript resides.

In the last few years I've been doing a lot of ASP.Net MVC at work, and the MVC pattern was something that I felt really comfortable with, so I also created `/controllers` and `/views` folders. As all my data gets passed around as JSON, and JavaScript doesn't have any classes, there are no Models to speak of so they didn't get folders.

All in all, `/stable` is a mirror of `/dev` and I just copy all files from `/dev` to `/stable` when I feel that the code is stable.

## Enter the EnvironmentManager

To make use of my new folder structure and `process.cwd()` I built the `EnvironmentManager`. Its sole purpose is to deal with environmental factors that differ from development and production.

It looks like this:

````js
/*****************************************
 *   Environment Manager
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/

var EnvironmentManager = (function() {

  var fs = require('fs');

  var misc = require('./misc').Misc;

  var currentEnvironment = null; // development or production
  var trackingCodeScript = null;

  return {

    init: function(trackingCodePath) {
      var cwdSplit = process.cwd().split('/');
      var cwdBase = cwdSplit[cwdSplit.length - 1];
      console.log('EnvironmentManager: Base dir is ' + cwdBase);

      if (cwdBase === 'dev') {
        currentEnvironment = 'development';
      } else {
        currentEnvironment = 'production';
        trackingCodeScript = fs.readFileSync(trackingCodePath);

        process.on('uncaughtException', function(err) {
          var log = fs.createWriteStream('exceptions.log', {'flags': 'a'});
          log.write(misc.getDateTimeNow() + ' - ' + err + '\n');
        });
      }
    },
		
    info: function(logMessage) {
      if (currentEnvironment === 'development') {
        console.log(logMessage);
      }

      return;
    },
		
    trackingCode: function() {
      if (currentEnvironment === 'production') {
        return trackingCodeScript;
      }
			
      return '';
    },
		
    httpPort: function() {
      return (currentEnvironment === 'development') ? 8080 : 80
    },
		
    httpsPort: function() {
      return (currentEnvironment === 'development') ? 8081 : 443
    }
  };

})();

typeof(exports) != 'undefined' ? exports.EnvironmentManager = EnvironmentManager : null;
````

It is initialized from `index.js` and checks if the current working directory is `/dev`. If it is, then we're in the development environment, if not, we're in production.

Here's what it's used for:

* Upon initialization (in production) it adds a listener to the `uncaughtException` event on `process` so that instead of crashing (and getting restarted by supervisor) it logs the exception to disk.
* It has a wrapper function around `console.log(...)` so that no logging to console is done in production.
* If we are in production it can give me my Google Analytics tracking code that I give to the ViewManager to insert into views. That way I don't polute my visitor statistics as I'm the only one using the development server.
* It also gives me the port numbers to start the servers on depending on which environment we're in.

The `EnvironmentManager` has been a nice addition to my code base as now I can deploy my development code to production without altering a single line of code. Hopefully this will lead to less downtime.
