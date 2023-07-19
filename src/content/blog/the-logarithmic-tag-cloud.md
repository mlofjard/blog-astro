---
slug: "the-logarithmic-tag-cloud"
title: "The Logarithmic Tag Cloud"
author: "Mikael Lofjärd"
dateTime: 2011-11-27T09:21:01+01:00
theme: "code"
tags: [
  "blog",
  "algorithms",
  "web-design"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
A few days ago I sat down and tagged all my posts. Last night I decided to write a tag cloud.

## The first try

I started out with a simple linear scale:

````js
var countDiff = maxCount - minCount;
var sizeDiff = maxSize - minSize;
if (countDiff == 0) countDiff = 1; // no divide by zero

for (var i in doc) {
  var weight = (doc[i].value - minCount) / countDiff;
  var size = minSize + Math.round(sizeDiff * weight);
  model.tags.push( { tag: doc[i].key, size: size , count: doc[i].value } );
}
````

* `maxCount` - The highest occurance of any tag.
* `minCount` - The lowest occurance of any tag.
* `maxSize` - The biggest allowed font size.
* `minSize` - The smallest allowed font size.
* `doc[i].key` - The name of the current tag.
* `doc[i].value` - The occurance of the current tag.

It rendered, but something looked odd. The linear scale isn't really that pretty in a tag cloud. Especially not when a few tags (in my case `#blog` and `#nodejs`) has a substantially bigger weight than the rest. I wanted things to be readable with a minimum font size and a maximum font size set by me so that it couldn't break the page layout.

I fiddled around for a while with a few other (not so successful) algorithms and then I almost gave up.

## Logarithms to the rescue</h4>

I finally thought of the logarithmic scale and after a couple of attempts it looked like my idea of a nice tag cloud.

````js
var countDiff = Math.log(maxCount) - Math.log(minCount);
var sizeDiff = maxSize - minSize;
if (countDiff == 0) countDiff = 1; // no divide by zero

for (var i in doc) {
  var weight = (Math.log(doc[i].value) - Math.log(minCount)) / countDiff;
  var size = minSize + Math.round(sizeDiff * weight);
  model.tags.push( { tag: doc[i].key, size: size , count: doc[i].value } );
}
````

If you haven't noticed it in the top menu yet you can check it out [here](http://lofjard.se/tags).
