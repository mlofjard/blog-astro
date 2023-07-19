---
slug: "handling-views-in-node-js"
title: "Handling Views in node.js"
author: "Mikael Lofjärd"
dateTime: 2011-12-03T22:46:13+01:00
theme: "code"
tags: [
  "nodejs",
  "blog",
  "mustache",
  "javascript"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
This weekend, my wife and daughter have been away up north, visiting my in-laws. I thought this would be a great opportunity for me to buffer up on some blog posts, but it seems like my inspiration mostly left with them.

Last Tuesday at my weekly tutorial at work we did a bit of work with jQuery and Mustache. On my blog I use Mustache, not only on the client side, but on the server side as well. As I enjoy using the MVC pattern, I have tried to implement it to the best of my extent.

## First things first

Mustache is a light weight templating engine with emphasis  on simplicity. It's been implemented for a lot of languages and one of them is JavaScript.

In Mustache, a template looks like this:

````html
Hello, my name is {{name}}!
````

In my case the templates involve a lot of HTML, but nevertheless it's simply a string with `{{` and `}}` used for marking up where the values should be inserted.

The JavaScript Mustache library has only one single method exposed; `to_html`.

`to_html` can take 2-4 arguments where the first is the template string and the second is the object with the values in it. In the JavaScript case that is a JSON object which suits me just fine since that what I use everywhere else in the blog. The other two arguments are used for partials and streaming the rendered template.

## The ViewManager

This is what my ViewManager looks like:

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

    renderView : function (response, viewName, model) {
      if (typeof(model.header) == 'undefined') {
        model.header = {};
      }
      model.header.trackingCode = env.trackingCode();
      model.footer = {};

      env.info('ViewManager: Rendering view ' + viewName);
      response.writeHead(200, { "Content-Type" : "text/html" });
      var html = mu.to_html(templates[viewName + '.mu'], model, partials, function (line) {
        response.write(line);
      });
      response.end();
      return;
    }
  };
    
}());

typeof(exports) != 'undefined' ? exports.ViewManager = ViewManager : null;
````

Upon initialization, I read all my template files from disk into memory. I also assign my partial templates to a <code>partials</code> object to pass on to Mustache. My partials are mainly what comes before and after themain content of each page on the blog. The other templates just contain the main content for each page.

This is the template for when you click on one of the tags in the tag cloud:

````html
{{>header}}
  <section class="comments">
    <header>
      Posts tagged with {{tag}}
    </header>
    <div class="taggedposts">
    {{#posts}}
      <div class="taggedpost">
        <header><a href="/post/{{readableKey}}">{{title}}</a></header>
        {{outtake}}
        <footer>written on {{readableDateTime}} by {{author}}</footer>
      </div>
    {{/posts}}
    </div>
  </section>
{{>footer}}
````

The `{{>header}}` and `{{>footer}}` tags are what renders the partials. Each partial uses a property on the model as its context so my `renderView` method assigns properties calles `header` and `footer` to my model.

The `{{#posts}}` and `{{/posts}}` tags are iterator tags. The template code between them gets run for every object in the `posts` array in my model.

## How to use it

Well how to use it is really up to you, but here's how I do it from my controllers:

````js
tag : function (request, response) {
  var tag = request.params.tag;

  db.view('posts/byTagAndDateTime', {
    startkey : [tag, 1],
    endkey : [tag],
    descending : true
  }, function (err, doc) {
    if (err) {
      env.info("CouchDB: DB Read error");
      staticFileController.error(request, response, 404);
      return;
    }

    var model = {};
    model.posts = new Array();

    for (var i in doc) {
      var post = doc[i].value;
      post.readableDateTime = misc.prettyDate(doc[i].key[2]);

      model.posts.push(post);
    }

    model.tag = tag;
    viewManager.renderView(response, 'tag', model);
    return;
  });
}
````

Line 26 is where the action is.

If you want to read more about Mustache, the check out its [GitHub page](http://mustache.github.com/) and that of its [JavaScript implementation](https://github.com/janl/mustache.js).
