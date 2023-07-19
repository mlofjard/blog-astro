---
slug: "a-simple-routing-solution-with-node-js"
title: "A Simple Routing Solution with Node.js"
author: "Mikael Lofjärd"
dateTime: 2011-11-25T23:27:23+01:00
theme: "code"
tags: [
  "nodejs",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
A few days ago I wrote about [not reinventing the wheel](http://lofjard.se/post/why-node-static-is-a-good-idea). Today I'm going to talk about the opposite.

If you're building an 'enterprise' grade application, reinventing the wheel is almost always the wrong thing to do. This blog however is something I do just for fun, and reinventing the wheel can sometimes be the best way to learn how stuff works. It's one of the reasons [Ayende](http://ayende.com/blog) had for writing [yet another document database](http://ravendb.net/), and it's the reason why I decided to write my own routing engine.

Sure enough I could have used the very popular [Express](http://expressjs.com/) framework, but where's the fun in that?

## What I wanted

As you might know, I work almost exclusively with the .Net stack at my job and I really like how routing is handled in ASP.Net MVC.

````csharp
routes.MapRoute(
  "Default",	// Route name
  "{controller}/{action}/{id}",	// URL with parameters
  new { controller = "Home", action = "Index", id = "" }	// Parameter defaults
);
````

I wanted something similar in my blog; easy to read, easy to configure and abstracted away from all that goes on when the http request happens.

## What I ended up with

This is my routing configuration (from `index.js`):

````js
var routes = {};
// blog routes
routes['blog:/'] = masterController.page;
routes['blog:/post/{id}'] = masterController.getPost;
routes['blog:/comment'] = masterController.comment;
routes['blog:/page'] = masterController.page;
routes['blog:/page/{key}'] = masterController.page;
routes['blog:/archive'] = masterController.archive;
routes['blog:/admin'] = masterController.admin;
routes['blog:/admin/get/{id}'] = masterController.getPostAsJSON;
routes['blog:/admin/submit'] = masterController.submitPost;

// default static file route
routes['file'] = masterController.file;
````

I don't have any complicated routes but never the less I wanted to have nice URLs. It also has support for virtual hosts which means I can have equal routes do different things depending on what sub domain I'm on.

If your'e wondering what the `masterController` is, it's just a wrapper controller thats responsible for initializing all my other controllers so I can keep `index.js` a little less cluttered.

My virtual host configuration (from `index.js`):

````js
var virtualDomains = {};
virtualDomains['lofjard.se'] =               { routeId: 'blog', wwwRoot: './content/lofjard' };
virtualDomains['www.lofjard.se'] =           { routeId: 'blog', wwwRoot: './content/lofjard' };
virtualDomains['xn--lofjrd-eua.se'] =        { routeId: 'blog', wwwRoot: './content/lofjard' };
virtualDomains['www.xn--lofjrd-eua.se'] =    { routeId: 'blog', wwwRoot: './content/lofjard' };
virtualDomains['foto.lofjard.se'] =          { routeId: 'foto', wwwRoot: './content/foto' };
virtualDomains['foto.xn--lofjrd-eua.se'] =   { routeId: 'foto', wwwRoot: './content/foto' };
````

I needed this since I have a photo site on a different sub domain that gets handled by the same node server.

And this is the router code:

````js
/*****************************************
 *   Router
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/

var Router = (function() {
  var url = require('url');
  var path = require('path');
  var querystring = require('querystring');

  var env = require('./environmentManager').EnvironmentManager;

  var resolveExcludes = ['.html', '.js', '.css', '.png', '.jpg', '.gif', '.ico', '.txt'];
  var virtualDomains = {};
  var routeTable = {};

  function buildRouteTable(routes) {
    for (var route in routes) {
      console.log('Server: Building route table entry for: ' + route);
      var routeSplit = route.split(':');
      var routeId = routeSplit[0]
      var routeName = routeSplit[1];

      if (routeName == null) routeName = route;

      var handle = routes[route];
      var pathName = routeName.split('/{')[0];
      var regexRoute = new RegExp(routeName.replace(/{\w+}/g, '{(\\w+)}') + '&#36;', '');
      var regexPath = new RegExp(routeName.replace(/{\w+}/g, '([^\/]+)') + '&#36;', '');
      routeTable[route] = {
        routeId : routeId,
        handle : handle,
        pathName : pathName,
        regexRoute : regexRoute,
        regexPath : regexPath
      }
    }
    return;
  }

  return {

    init: function(virtualDomainsInit, routes) {
      virtualDomains = virtualDomainsInit;
      buildRouteTable(routes);
    },

    route: function(request, response) {
      var pathName = url.parse(request.url).pathname;
      var hostName = request.headers['host'].split(':')[0];

      // if request is for unknown sub domain, let the file handler handle it
      if (typeof(virtualDomains[hostName]) === 'undefined') {
        routeTable['file'].handle(request, response);
        return;
      }

      if (resolveExcludes.indexOf(path.extname(pathName)) === -1) {
        env.info('Router: About to route a request for ' + pathName);

        for(var route in routeTable) {
          if (virtualDomains[hostName].routeId === routeTable[route].routeId &&
              routeTable[route].regexPath.test(pathName)) {
            var attributes = routeTable[route].regexRoute.exec(route);
            var values = routeTable[route].regexPath.exec(pathName);

            var qs = {};

            if (attributes.length > 1) {
              for (var i = 1; i < attributes.length; i++){
                qs[attributes[i]] = values[i];
              }

              request.url = routeTable[route].pathName + '?' + querystring.stringify(qs);

              env.info("Router: Rewrote request url as " + request.url);
            }

            routeTable[route].handle(request, response);
            return;
          }
        }
      }

      env.info('Router: Static file request for ' + pathName);
      
      // default fallback on static file handler if no route matched the request
      routeTable['file'].handle(request, response);
    }
  };
	
}());

typeof(exports) != 'undefined' ? exports.Router = Router : null;
````

Upon initialization it traverses all routes in the configuration and creates two regular expressions for each route. One RegEx is used for getting the attribute names and the other is used for fetching the attribute values.

When the request comes in I get the host name for the request and check if it exists in my virtual domain list. If it doesn't I just hand things over to the static file handler which will serve up a 404.

I then check if the URL that was requested has a file ending that I know is a static file. If so I skip the routing code and my fallback static file handler takes care of the request.

If it's not a known static file extension, then the fun begins. I traverse all the routes checking if it matches the RegEx for getting attributes and if the route id matches the one set up for the current virtual domain.  
If it matches I extract the attributes and values, if any, and attach them to the request object as a querystring. I might rewrite this part in the future so that I just extend them as properties to the request object instead of using the querystring.

Then I execute the assigned function for that route. Done.
