---
slug: "architecture-in-javascript---modules"
title: "Architecture in Javascript - Modules"
author: "Mikael Lofjärd"
dateTime: 2011-11-24T12:14:18+01:00
theme: "code"
tags: [
  "commonjs",
  "javascript",
  "architecture"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
About a week ago I wrote about [turning client side JavaScript into CommonJS modules](http://lofjard.se/post/the-power-of-commonjs). The scoping of variables in CommonJS makes this easy, but what if we wanted to do it the other way around?

In CommonJS, modules are scoped by file and all public methods and properties must be propagated through the <code>exports</code> object.

````js
var foo = 'foo';

function bar() {
  return foo;
}

exports.bar = bar;
````

In the above example the `foo` property is private to the CommonJS module and can only be read from the outside by the public method `bar()`.

If we were to include this JavaScript file on the client however, the property `foo` and the method `bar()` would both exist in the same scope as all other JavaScript files. What we need is to scope our module.

## Object Literal Notation

In JavaScript, everything is an object. Object Literal Notation lets us take advantage of this and markup our module in a kind of 'fake' namespace.

````js
var myModule = {
  foo: 'foo',

  bar: function() {
    return this.foo;
  }
};

exports.myModule = myModule;
````

Using Object Literal Notation we have now scoped our module inside a `myModule` namespace. If we were to include this JavaScript file on the client, only `myModule` would go into the global document scope.

The `foo` property is still public though and can be accessed using `myModule.foo` from the outside.

If you have no use for private properties then Object Literal Notation is an easy way to scope your module.

## The Module Pattern

The Module Pattern (made popular by among others [Douglas Crockford](http://www.crockford.com/)) is a clever mix of [Immediately Invoked Function Expression](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) and Object Literal Notation.  
Instead of returning a function, as in <abbr title="Immediately Invoked Function Expression">IIFE</abbr>, it returns an object.

````js
var myModule = (function() {
  var foo = 'foo';

  return {
    bar: function() {
      return this.foo;
    }
  };
}());

exports.myModule = myModule;
````

Now the `foo` property is private to our module even on the client side. This is how I choose to build my modules yesterday when I rewrote the blog.

## What about exports?

If you haven't noticed by now, none of our examples actually works in the browser. That's because the `exports` object doesn't exist outside of the CommonJS world.

One could of course create it in the global document scope but a better way would be to include some sanity checks in our module.

````js
typeof(exports) != 'undefined' ? exports.myModule = myModule : null;
````

Now we ignore `exports` if the object doesn't exist.

## Some blog source code

I've done this for everything in my source as it allowed be to break things up into smaller pieces, and I use a `init(...)` method in my modules `return {...}` statement to inject different dependencies from the outside.

Not all my modules make sense to put on the client of course, but one I made is actually usable on the client side as well.

````js
/*****************************************
 *   Misc functions
 *****************************************
 *   Author:  mikael.lofjard@gmail.com
 *   Website: http://lofjard.se
 *   License: MIT License
 ****************************************/

var Misc = (function() {

  var dateTimeRegex = new RegExp('([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+:[0-9]+).+&#36;', '');

  function doubleDigit(digit) {
    return (digit &lt; 10) ? '0' + digit : digit;
  }

  return {
    monthNames: ['unknown', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    getDateTimeNow: function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = doubleDigit(now.getMonth() + 1); //indexed from 0-11 =)
      var day = doubleDigit(now.getDate());
      var hours = doubleDigit(now.getHours());
      var mins = doubleDigit(now.getMinutes());
      var secs = doubleDigit(now.getSeconds());
      var tz = doubleDigit(-now.getTimezoneOffset() / 60); //offset in negative minutes

      return year + '-' + month + '-' + day + 'T' + hours + ':' + mins + ':' + secs + '+' + tz + ':00';
    },

    prettyDate: function(dateTime) {
      var parsedDateTime = dateTimeRegex.exec(dateTime);

      var year = parsedDateTime[1];
      var month = parseInt(parsedDateTime[2]);
      var day = parseInt(parsedDateTime[3]);
      var time = parsedDateTime[4];

      return this.monthNames[month] + ' ' + day + ', ' + year + ' at ' + time;
    }
  };

}());

typeof(exports) != 'undefined' ? exports.Misc = Misc : null;
````

I'm planning on making the entire blog source code available right here on the blog, but that will be the topic for another post.
