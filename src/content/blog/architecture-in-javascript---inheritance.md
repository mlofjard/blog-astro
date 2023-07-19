---
slug: "architecture-in-javascript---inheritance"
title: "Architecture in JavaScript - Inheritance"
author: "Mikael Lofjärd"
dateTime: 2011-11-29T22:40:46+01:00
theme: "code"
tags: [
  "javascript",
  "architecture"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
There's been a lot of debate over the years about whether JavaScript is an object-oriented language or not. Most of these discussions seem to pan out into arguments over inheritance.

JavaScript, by design, lends itself well to inheritance through extension. However, JavaScript can support lots of different types of inheritance. 
I'm going to talk about a few of them today.

Consider the following code:

````js
function Car() {
  this.color = "Blue";
  this.brand = "unknown";  
}

function Ford() {
  var o = new Car();
  for(var i in o) {
    this[i] = o[i];
  }
  this.brand = "Ford";
}

var myCar = new Car();
var myFord = new Ford();
````

The `myCar` object would have the properties `color` and `brand`. The `Ford()` constructor method creates inheritance by creating a `Car` and copying all its properties. It then sets its `brand` property to a new value. 

`Ford` now inherits from `Car`. But what if we want it to be able to inherit things in a more flexible way?

````js
function Car() {
  this.color = "Blue";
  this.brand = "unknown";  
}

function Train() {
  this.color = "Red";
  this.brand = "unknown";  
}

function Ford(F) {
  var o = new F();
  for(var i in o) {
    document.write('  - i: ' + i + ' -   ');
    this[i] = o[i];
  }
  this.brand = "Ford";
}

var myCar = new Car();
var myFord = new Ford(Car);
var myOtherFord = new Ford(Train);
````

Now we would have a blue Ford car and a red Ford train. This could be done in another way:

````js
function Car() {
  this.color = "Blue";
  this.brand = "unknown";  
}

function Train() {
  this.color = "Red";
  this.brand = "unknown";  
}

function Ford(o) {
  function F () {}
  F.prototype = o;
  var a = new F();
  a.brand ="Ford";
  return a;
}

var myCar = new Car();
var myTrain = new Train();
var myFord = new Ford(myCar);
var myOtherFord = new Ford(myTrain);
````

Oh My God! Now we're inheriting from objects instead! And using prototype! Why don't we go a step further?

````js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function Car() {
  this.color = "Blue";
  this.brand = "unknown";  
}

function Train(o) {
  var a = new object(o);
  a.color = "Red";
  a.brand = "Märklin";
  return a;
}

function Ford(o) {
  var a = new object(o);
  a.brand ="Ford";
  return a;
}

var myCar = new Car();
var myFord = new Ford(myCar);
var myTrain = new Train(myFord);
````

Now we have objects inheriting objects inheriting objects. How object-oriented isn't that?

Of course, for these extremely simplified cases, why would I need inheritance anyway? In fact, I can't really figure out what I would need inheritance for anyway in JavaScript. Prototype extensions seem much more flexible to me. But if, in the future, I ever find a use for it, I'll make sure to write about it here.

Also, make sure you read Mr. Crockford's old (2001) post on [Classical Inheritance in JavaScript](http://www.crockford.com/javascript/inheritance.html). There are quite a few really funny ways to do this in there although I would not use them myself.

So to sum it up; if you think you need inheritance then please look closer at prototype extensions as an alternative. If you _really_ need inheritance then know that it can be achieved.
