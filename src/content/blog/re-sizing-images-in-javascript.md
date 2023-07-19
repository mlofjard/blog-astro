---
slug: "re-sizing-images-in-javascript"
title: "Re-sizing Images in Javascript"
author: "Mikael Lofjärd"
dateTime: 2013-05-02T19:50:13+02:00
theme: "code"
tags: [
  "javascript",
  "html"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
[Uploading files asynchronously](//lofjard.se/post/async-file-uploads-in-html5) with XMLHttpRequest is a neat trick on its own, but what I really wanted was a nice way to upload images from my phone and/or tablet.

The problem with this is that technology is evolving quite rapidly  these days and my smartphone has an 8 megapixel camera. 8 megapixel pictures averages around 2.2 MB on my iPhone 5 and Chrome (and others) defaults file uploads with XMLHttpRequest to 1 MB. Now, one can easily find their way around such limitations but then you just run straight into the arms of the next thing limiting your upload sizes; the web server.

And even if you would change all the settings, to allow larger file uploads, you'd have to ask yourself if that's what you really want. It wasn't what I wanted.

Uploading photos from my phone is awesome since it's really an internet connected camera, but when I'm on the go I don't want to spend minutes uploading a file on a crappy cellphone connection. Besides, the largest size for images on my blog is 490 pixels, so what I wanted was to resize the images in the browser, _before_ it's sent to the server.

Once again, HTML5 comes to the rescue.

## Stretched on a wooden frame

The HTML5 spec introduced a nifty little element called `canvas`. It's actually pretty much the same as it's old namesake used for oil paintings since the 15th century. It is a blank area ready to be filled with pixels and some nice Javascript APIs for getting them there (and off of there).

```html
<input type="file" id="file-upload" />
<img src="img/placeholder.png" id="upload-preview" />
```

Using the File API we can make the `img`-tag load our image as soon as we've selected it.

```js
var fileUpload = document.getElementById('file-upload');
var uploadPreview = document.getElementById('upload-preview');

fileUpload.addEventlistener('change', function () {
  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    uploadPreview.src = e.target.result;
  };
  reader.readAsDataURL(file);
}, false);
```

To play with the FileReader you need a bleeding edge browser such as Internet Explorer 10, Chrome 7 or Firefox 3.6 (!!!). =)

All jokes aside, Microsoft has been late to the game but at least they have arrived.

## What good is a preview?

The preview image in itself isn't helping us much with our client-side re-sizing, but this is where the `canvas` element comes in handy.

```js
var canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
var ctx = canvas.getContext("2d");
ctx.drawImage(uploadPreview, 0, 0, 640, 480);
```

And voila! We have now redrawn our image on a `canvas` object at 640x480 resolution. In reality you'll want to calculate the width and height from the original image to keep the aspect ratio, but for example purposes this will do.

## Uploading from the canvas

So we have our image resized in a `canvas` element. Now how do we get it out? The `canvas` element has a method named `toDataURL` that can help us with that.

```js
var jpeghigh = canvas.toDataURL("image/jpeg", 0.9);
var jpeglow = canvas.toDataURL("image/jpeg", 0.4);
var pngmedium = canvas.toDataURL("image/png", 0.6);
```

Here I've created 3 different images. Two JPEGs and one PNG. As you might have deduced the first argument to `toDataURL` is a mime type descriptor and the second is the quality.

DataURLs are nice but I want a binary object that I can [send with my XMLHttpRequest](//lofjard.se/post/async-file-uploads-in-html5).

```js
function dataURItoBlob(dataURI, dataType) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}
```

Before you go off to the comments, pitch forks in hand, shouting "ArrayBuffers are deprecated since Chrome v23!!", have a little faith in me.

I am very well aware (and Chrome reminds me every time I upload a picture) but sending the `ArrayBufferView` `UInt8Array` directly to the `Blog` constructor (as one should do) works great on the desktop, but it doesn't work on the iPhone. The above code works in both.

## The catch

There always has to be one, doesn't there?

The thing about the above code is that it doesn't work all that well at all with the iPhone (or the iPad if you have one of those). The reason for this is iOS habit of not rotating photos when taken, but instead incorporate the `Orientation` flag in the EXIF metadata. This means that when you draw an image taken in portrait mode (on the iPhone, landscape mode in the iPad) on the canvas, it will be rotated 90 degrees. There is also an image squashing bug with files above a certain size but both of these are a subject for another time.

If you need a library that takes care of both of these issues I recommend that you check out the excellent [canvasResize](https://gokercebeci.com/dev/canvasresize) library by G&ouml;ker Cebeci.
