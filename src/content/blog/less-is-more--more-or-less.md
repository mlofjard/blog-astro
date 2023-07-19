---
slug: "less-is-more--more-or-less"
title: "LESS Is More, More Or Less"
author: "Mikael Lofjärd"
dateTime: 2012-03-09T00:05:09+01:00
theme: "code"
tags: [
  "css",
  "web-design",
  "blog",
  "nodejs"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
A while back I read a blog post somewhere about how the [LESS](http://lesscss.org/) parser/compiler had been remade in Javascript.

"Well awesome", I thought to myself as I had been wanting some more flexibility in CSS but had been to stubborn/proud to install the SASS compiler since it's written in Ruby. Needles to say, I wanted to incorporate it in my blog as soon as possible but I've not had the time to actually do it until now.

#### LESS you say?

LESS (like SASS) is a CSS derived language that adds a whole lot of long needed features to CSS to ease maintenance of large style sheets. It compiles into regular CSS markup either in realtime (through their nifty Javascript implementation in the browser) or, as in my case, as a bootstrapping task when I start my blog.

For now, it's tacked on in a kind of ugly way in my BundleController, but I might redo the actual code some day since I'm not pleased with it. It works though so for now it will have to suffice.

#### What does if bring to the table?

It brings variables (!!!). Finally you can stop sprinkling your CSS files with color descriptions and font sizes:

````css
@white: #fff;

.myClass {
  background-color: @white;
}
````

It's as easy as that.

It also brings something called mixins, which is kind of like multiple inheritance:

````css
.basefont(@size: 12px) {
  font-family: Arimo, sans-serif;
  font-size: @size;
}

body {
  .basefont;
}

h1 {
  .basefont(24px);
}
````

Mixins can be quite useful in cutting down on repetitive CSS code, and it has support for parameters and default values.

LESS also lets you nest your rules to reduce repeating your selectors:

````css
div.sitewrapper {
  >nav {
    ul {
      margin: 7px 0px 2px 5px;
      li {
        margin: 3px 0 2px 0;
        a {
          width: 70px;
        }
      }
    }
  }
}
````

When this is compiled it is turned into:

````css
div.sitewrapper > nav ul {
  margin: 7px 0px 2px 5px;
}

div.sitewrapper > nav ul li {
  margin: 3px 0 2px 0;
}

div.sitewrapper > nav ul li a {
  width: 70px;
}
````

There is also support for a lot more complex nesting rules and a calculation API so that you can calculate colors and distances and make relative offsets and such. I recommend you to read up on <http://lesscss.org/> about all the cool features of less.

#### So does it make your life easier?

It's kind of hard to say since I just got it running and my style sheet probably needs more work done on it, but so far I've been able to cut around 50 lines of CSS out of my ~660 line file, and it has gotten a lot less repetitive and a lot more easier to read I think.

It's not deployed yet but when I deploy it this weekend I will let you be the judges as the source code is made available as usual.
