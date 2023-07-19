---
slug: "automatic-minification-and-bundling-with-node-js"
title: "Automatic Minification and Bundling with node.js"
author: "Mikael Lofjärd"
dateTime: 2011-11-29T22:51:49+01:00
theme: "code"
tags: [
  "javascript",
  "css",
  "nodejs",
  "minification"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Scott Guthrie recently wrote about the new [minification and bundling](http://weblogs.asp.net/scottgu/archive/2011/11/27/new-bundling-and-minification-support-asp-net-4-5-series.aspx) process that has been built for ASP.Net 4.5.

I read his blog post, liked what I read and then I though of doing the same thing for my blog. I've been looking at minification programs for a while but I've put it off so far because I didn't want to add another step to my manual deployment process. Now I'm thinking I don't have to have another step. I could do it "automagically".

## The BundleController
````js
/*****************************************
 *   Bundle Controller
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/

var BundleController = (function () {
    
  var url = require('url');
  var fs = require('fs');
  var path = require('path');

  var cssmin = require('cssmin');
  var jsmin = require('uglify-js');

  var env = require('../environmentManager').EnvironmentManager;
  var dm = require('../domainManager').DomainManager;

  var config = null;
  var staticFileController = null;
    
  function sortCss(a, b) {
    if (a === 'normalize.css')
      return -1;
    if (b === 'normalize.css')
      return 1;
    if (a === 'shCore.css')
      return -1;
    if (b === 'shCore.css')
      return 1;
    return (a &lt; b) ? -1 : ((a &gt; b) ? 1 : 0);
  }

  function sortScripts(a, b) {
    if (a === 'lofjard.js')
      return -1;
    if (b === 'lofjard.js')
      return 1;
    return (a &lt; b) ? -1 : ((a &gt; b) ? 1 : 0);
  }

  function createCssBundle() {
    var wwwRoots = dm.getAllWwwRoots();

    for (var i in wwwRoots) {
      var cssPath = path.join(wwwRoots[i], config.css.path);
      var bundleFilePath = path.join(cssPath, '_bundled.css');
      console.log('BundleController: CSS bundle path is ' + bundleFilePath);
      try {
        fs.unlinkSync(bundleFilePath);
      } catch (ex) {}

      var files = fs.readdirSync(cssPath);
      files.sort(sortCss);
      var bundleData = '';

      for (var filename in files) {
        console.log(' - Bundling CSS ' + path.join(cssPath, files[filename]));
        var file = fs.readFileSync(path.join(cssPath, files[filename]), 'utf-8');
        bundleData += (file + '\n');
      }

      if (config.css.minimize) {
        bundleData = cssmin.cssmin(bundleData);
      }

      fs.writeFileSync(bundleFilePath, bundleData, 'utf-8');
    }
  }

  function createScriptsBundle() {
    var wwwRoots = dm.getAllWwwRoots();
    for (var i in wwwRoots) {
      var jsPath = path.join(wwwRoots[i], config.scripts.path);
      var bundleFilePath = path.join(jsPath, '_bundled.js');
      console.log('BundleController: JavaScript bundle path is ' + bundleFilePath);

      try {
        fs.unlinkSync(bundleFilePath);
      } catch (ex) {}

      var files = fs.readdirSync(jsPath);
      files.sort(sortScripts);
      var bundleData = '';

      for (var filename in files) {
        console.log(' - Bundling JavaScript ' + path.join(jsPath, files[filename]));
        var file = fs.readFileSync(path.join(jsPath, files[filename]), 'utf-8');
        bundleData += (file + '\n');
      }

      if (config.scripts.minimize) {
        var ast = jsmin.parser.parse(bundleData);
        ast = jsmin.uglify.ast_mangle(ast);
        ast = jsmin.uglify.ast_squeeze(ast);
        bundleData = jsmin.uglify.gen_code(ast);
      }

      fs.writeFileSync(bundleFilePath, bundleData, 'utf-8');
    }
  }

  return {
    init : function (configInit, staticFileControllerInit) {
      config = configInit;
      staticFileController = staticFileControllerInit;
      createCssBundle();
      createScriptsBundle();
    },

    bundleScripts : function (request, response) {
      request.url = path.join(config.scripts.path, '_bundled.js');
      env.info('BundleController: Rewriting request as ' + request.url);
      staticFileController.file(request, response);
      return;
    },

    bundleCss : function (request, response) {
      request.url = path.join(config.css.path, '_bundled.css');
      env.info('BundleController: Rewriting request as ' + request.url);
      staticFileController.file(request, response);
      return;
    }
  };
    
}());

typeof(exports) != 'undefined' ? exports.BundleController = BundleController : null;
````

Nothing wierd here. It just bundles my scripts in alphabetical order, except for a few scripts and css files that are prioritized. Normalize.css gets top place in the bundling process and so would jQuery if I would host it myself.

I use [node-cssmin](https://github.com/jbleuzen/node-cssmin) for CSS minification and [UglifyJS](https://github.com/mishoo/UglifyJS) for JavaScript minification. None of this is in the production code yet since it was completed about 15 minutes ago and I need to do more testingon the JavaScript side, but on the development server the CSS bundling and minification works like a charm and has cut my CSS size by one third, but most importantly it has replaced 4 http requests with just one and cut the time for fetching css by 3/4.

The `BundleController` gets its configuration from `index.js` and it looks like this:

````js
var bundleConfig = {
  scripts: {
    path: '/scripts',
    minimize: true,
    compress: true
  },
  css: {
    path: '/css',
    minimize: true,
    compress: true
  }
}
````

For now I don't act on the `compress` property, but when I find a good way to send gzip files if the client supports it through `node-static` then at least I already have it configured.

I also added two new routes to my configuration:

````js
routes['blog:/scripts'] = masterController.bundleScripts;
routes['blog:/css'] = masterController.bundleCss;
````

That's really all there is to it. If I request `lofjard.se/css/normalize.css` I get the regular, untouched CSS file, but if I go to `lofjard.se/css` I get the minified version of all CSS files in the `/css` directory.
