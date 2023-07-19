---
slug: "decreasing-load-time-when-using-google-web-fonts"
title: "Decreasing Load Time When Using Google Web Fonts"
author: "Mikael Lofjärd"
dateTime: 2013-05-04T10:19:20+02:00
theme: "code"
tags: [
  "cdn",
  "webfonts",
  "blog",
  "performace",
  "web-design"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I've been using [Google Web Fonts](http://www.google.com/webfonts) ever since I started building this blog. It's an awesome service with a great user interface and it makes it really easy to add fonts to your web site.

Of course I had to find something wrong with it.

Earlier this week our company released our new web site. On our Yammer page, one of my colleagues posted a link to [a WebPageTest result](http://www.webpagetest.org/result/130503_CB_P7E/) for it and it fared reasonably well. It got an "F" on the "First Byte Time" test, but that test is really finicky and could just as well show an "A" if you retake the test (as I later became aware).

This triggered my inner masochist and I just had to run the same test on this blog. The first result was this:

Test | Score
----|:--:
First Byte Time | A
Keep-alive Enabled | A
Compress Transfer | A
Compress Images | C
Cache static content | C
Effective use of CDN | X

To be honest, I actually got an "F" on "First Time Byte" but then I ran the test a second time and got an "A". Another time I got a "B".

It turns out that "First Time Byte" includes the time it takes to perform the DNS lookup. As I don't wield much power over the DNS servers of the world, I ignored it when it came to my own server, but it would turn out to be quite the interesting thing when I went on to fix my C grades.

## Compress images

This one was easy. WebPageTest complains if JPEGs are above 50% quality (with a 10% margin), so the [image of my robot](//lofjard.se/post/pictures)  uploaded with my [image uploader](//lofjard.se/post/async-file-uploads-in-html5) and [re-sized on the client](//lofjard.se/post/re-sizing-images-in-javascript), was the culprit here.

I re-encoded it at 50% quality and updated my upload script to always use 0.5 as the quality constant.

## Cache static content

Google doesn't add any expiration headers to the Web Fonts CSS. I'm guessing that this is because they make changes to the underlying code that generates this CSS sometimes, and the want the changes to propagate as fast as possible.

I am however not that concerned about my fonts as I've already tested that they do what I want, so I would prefer them to be infinitely cached. So I thought about hosting them myself, as I already was doing with my symbol font (Elusive Icons).

At first I thought, well that will put more strain on my server, and it definitely goes against CDN best practices. But then I went ahead and checked my timeline readings at WebPageTest, and it turns out that even though the font data is transferred quickly from Googles servers, the DNS lookup for those where taking quite some time.

`fonts.googleapis.com` took roughly 300 ms to lookup, but that wasn't the worst one.

`themes.googleusercontent.com` took more than a 1000 ms to resolve and that is the server that the font files are actually on.

Now this has to be taken with a grain of salt, just like the "First Byte Time" since DNS lookup could be really fast if the test was retaken. But it got me thinking.

No matter how you look at it, `lofjard.se` needs to be resolved, once, if you want to load this site. But then the resolved address is cached and every other subsequent request to `lofjard.se` will skip the DNS lookup step.

Hosting the web font CSS in my own CSS-file meant one less request, but hosting the web font files myself meant that the 6 font file requests where now directed at `lofjard.se` instead of another server. The question was if I could download the fonts from my own server in less time than I could DNS loopkup and download them from Google, even when taking a parallelization hit from the fact that most browsers only allow 4 simultaneous requests to the same server? The answer was YES.

My [latest result from WebPageTest](http://www.webpagetest.org/result/130503_HB_12DQ/) shows a much nicer score:

Test | Score
----|:--:
First Byte Time | A
Keep-alive Enabled | A
Compress Transfer | A
Compress Images | A
Cache static content | A
Effective use of CDN | X

#### That dreadful "X"

I still get an "X" at CDN usage, and I've actually gotten worse at it since I now use two less CDNs than before. But it goes to show that while CDNs are great, they are not always the answer to performance.
