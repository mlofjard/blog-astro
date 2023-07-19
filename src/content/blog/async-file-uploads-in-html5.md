---
slug: "async-file-uploads-in-html5"
title: "Async File Uploads in HTML5"
author: "Mikael Lofjärd"
dateTime: 2013-05-01T22:30:20+02:00
theme: "code"
tags: [
  "html",
  "javascript",
  "nodejs",
  "ajax"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Uploading files using HTML forms has always felt a bit off for me. You had to set your encoding to `multipart/form-data` and the synchronous nature of form posts always made it a waiting game when uploading larger files.

Then came AJAX and the dawn of "single page applications" and such buzzwords, but file uploads somehow got left behind. Javascript didn't have the access it needed to send files with the `XMLHttpRequest`. Years passed and along came the File API and XMLHttpRequest Level 2 (it seems to be called that again) with its `upload` attribute, support for byte streams and progress events.

Today I'm going to show you how to build an asynchronous file uploader with it.

We'll start with the HTML part:

```html
<input type="file" id="files-upload" multiple />

<ul id="file-list"></ul>
```

There's nothing weird going on here; just a regular file selector and a list of uploaded files. The `multiple` attribute is added so that we can upload more than one file at the time.

We want our files to upload as soon as they are selected so we hook up to the `change` event on our file selector input.

```js
var filesUpload = document.getElementById('files-upload');
filesUpload.addEventListener("change", function () {
  traverseFiles(this.files);
}, false);
```

The `traverseFiles` function checks for File API support and calls the `upload` function on each of the selected files:

```js
function traverseFiles (files) {
  if (typeof(files) !== "undefined") {
    for (var i = 0; i < files.length; i++) {
      upload(files[i]);
    }
  }
  else {
    var fileList = document.getElementById('file-list');
    fileList.innerHTML = "No support for the File API in this web browser";
  } 
}
```

## Uploading

The `upload` function is where the actual uploading happens:

```js
function upload(file) {
  var li = document.createElement("li"),
    div = document.createElement("div"),
    progressBarContainer = document.createElement("div"),
    progressBar = document.createElement("div"),
    fileList = document.getElementById('file-list'),
    xhr;

  progressBarContainer.className = "progress-bar-container";
  progressBar.className = "progress-bar";
  progressBarContainer.appendChild(progressBar);
  div.appendChild(progressBarContainer);
  li.appendChild(div);

  // add list item with progress bar
  fileList.appendChild(li);

  // create the XMLHttpRequest object
  xhr = new XMLHttpRequest();
  
  // attach progress bar event
  xhr.upload.addEventListener("progress", function (e) {
    if (e.lengthComputable) {
      progressBar.style.width = (e.loaded / e.total) * 100 + "%";
    }
  }, false);
  
  // attach ready state change event
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState == 4) { // if we are done
      if (xhr.status == 200) { // and if we succeded
        progressBarContainer.className += " uploaded";
        progressBar.innerHTML = "Uploaded!";
        
        div.appendChild(document.createTextNode(file.name + '(' + file.size + ')'));
      } else {
        div.className += ' upload-error';
        progressBar.innerHTML = "Failed!";
        div.appendChild(document.createTextNode(file.name));
      }
    }
  }, false);

  // open the request asynchronously
  xhr.open("post", "/upload", true);
      
  // set some request headers
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  xhr.setRequestHeader("X-File-Name", file.name);
  xhr.setRequestHeader("X-File-Size", file.size);
  xhr.setRequestHeader("X-File-Type", file.type);

  // send the file
  xhr.send(file);
}
```

Note how we bind to the `progress` event on `xhr.upload`. That is because the `upload` property is actually another type of XMLHttpRequest object that is similar but not the same as its parent. In this case, all you need to now is that all the events for the actual upload propagates on this object.

## Receiving the file

The node.js side of things is not that hard either, assuming that the server below is forwarded to from the `/upload` URL that we posted to.

```js
var http = require('http');
var fs = require('fs');

function onRequest(request, response) {
  request.setEncoding('binary');

  var postData = '';
  request.addListener('data', function (postDataChunk) {
    postData += postDataChunk;
  });

  request.addListener('end', function () {
    var fileName = request.headers['x-file-name'];

    fs.writeFile(fileName, postData, { encoding: 'binary' }, function(err) {
      if (err) {
        response.writeHead(500);
        response.write("File write error.");
        response.end();
      } else {
        response.writeHead(200, 'application/json');
        response.write("Success!");
        response.end();
      }
    })
  });
}

http.createServer(onRequest).listen(80);
```

The important thing to note here is the `request.setEncoding('binary');`, at the beginning of the `onRequest` method, and the `{encoding: 'binary'}` option sent to `fs.writeFile()`.

Of course, in a real world situation you might want some more logic in place to ward of misuse from malicious people or control what type of files get uploaded. In my case I added some logic for making sure (it's in the admin section of my blog so I don't have to be 100% sure) that I only upload images.

I also do some nifty re-sizing of my images before they are uploaded which takes care of long upload times and default size limits for XMLHttpRequests (Chrome defaults to 1 MB) but that is the subject for another time.
