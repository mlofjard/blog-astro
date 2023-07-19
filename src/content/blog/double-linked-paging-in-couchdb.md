---
slug: "double-linked-paging-in-couchdb"
title: "Double linked paging in CouchDB"
author: "Mikael Lofjärd"
dateTime: 2011-11-15T00:56:00+01:00
theme: "code"
tags: [
  "couchdb",
  "nodejs",
  "blog"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Yesterday I said that I would look into paging, as my post count had reached 10+, so that's what I did today.

Paging in CouchDB isn't all that straight forward for a bunch of reasons that I'll try to explain.

Firstly, to be able to query anything in Couch you need a View. A Couch View is basically a really fast hash of your documents that is constructed with a little piece of javascript (like everything in Couch).

In my case it looks like this:

````js
function(doc)
{
  if(doc.type === "blogpost" && doc.published) {
    emit(doc.dateTime, doc);
  }
}
````

The execution of this code is what makes Couch so fast for reads. The magic can be read about [here](http://couchdb.apache.org/docs/overview.html) and if you're interested in how Couch maintains its indexes, then it's a good read. It is however not the point of this blog post.

The important thing to know about the above piece of code is that it returns all published blogposts with the `dateTime`-attribute as the Key and the whole document as the Value.

The reason for using a date and time as the key in this view is that Couch always sorts its views on the key and I wan't my blog posts to be returned to me in reversed chronologic order.

CouchDB has a few interesting arguments that you can set when querying a view:

* `key` - If set, the query will only return documents with that key.
* `descending` - Is used to set the sort order.
* `startkey` - The start key of a range of keys to query for.
* `endkey` - The end key of a range of keys to query for.
* `limit` - Select only a set number of documents.
* `skip` - Skip a number of documents before yielding results.

## Easy paging

Now the easy way of doing this would be to set `limit = page size` and `skip = page size * page number` (zero-indexed of course).

The problem with that is that `skip` is an expensive operation in Couch. In my case with 10-20 blog posts by now it wouldn't even matter but if it's worth doing, it's worth doing it right.

## Double linked (awesome) paging

Single linked paging wasn't that hard either but I wanted more then an "Older posts" button. I (for some weird reason) was hell bent on also having a "Newer posts" button so that I could step freely forwards and backwards through my posts.

The trick relies on using the `startkey`-, `limit`- and `descending`-arguments.

On the front page I use an "A" as my `startkey`. I also set `descending = true` so that I will get my results in reverse order. When querying with `descending = true` I needed a value for `startkey` that was greater than any I could have as keys in my view. Since my keys were timestamps starting with the year number I knew that a letter would be considered "greater". (remember the reverse part)

I then set `limit = page size + 1`. The +1 document is never displayed on the website but I use its key as my `startkey` for the next page. And if the result size is less than page size + 1 then I have reached the last page.

The "previous page"-button was a bit trickier to figure out but the solution was quite simple.

The same way I use the +1 document as the `startkey` to get to the next page I use the first post in the result as the `startkey` to get to the previous page, only this time I query with `descending = false` and `limit = page size + 2`.

If the result size is less then page size +2 then I'm at the first page, and all I have to do then is reverse the result manually and then do all the same stuff as before.

## Code

Here is the code to help you figure out what I just said. I'm not really that good at explaining this stuff in the middle of the night. =)

````js
function page(request, response) {
  var key = url.parse(request.url, true).query.key;

  var startKey = 'A';
  var pageSize = 8; // 7 for show and 1 for reference
  var desc = true;
  var firstPage = true;

  if(key) {
    var prefix = key.substring(0, 1);
    desc = (prefix != 'p');
    startKey = key.substring(1);
    firstPage = false;
  }

  var nextPageKey = null;
  var prevPageKey = null;

  var queryargs = { descending: desc, limit: (desc ? pageSize : pageSize + 1), startkey: startKey};
  db.view('posts/publishedByDateTime', queryargs, function (err, doc) {
    if (err) {
      console.log("CouchDB: DB Read error");
      error(request, response, 404);
      return;
    }

    if (!desc) {
      if (doc.length < pageSize + 1) {
        firstPage = true;
      } else {
        doc.pop();
      }

      // reverse doc if we came from a "prev page" click
      // since we then selected with descending: false;
      doc.reverse();
    }

    // if result size = page size then remove the last item
    // in the array but store its key for the next page button
    if (doc.length == pageSize) {
      nextPageKey = doc.pop().key;
    }

    // if there are results and we are not on the first
    // page then set the key for the previous page button
    if (doc.length > 0 && !firstPage ) {
      prevPageKey = doc[0].key;
    }

    // create a list of posts and keys for use in the html
    var postList = {
      posts : doc,
      olderPosts: (nextPageKey != null),
      nextPageKey: 'n' + nextPageKey,
      newerPosts: (prevPageKey != null),
      prevPageKey: 'p' + prevPageKey,
      renderPageNav: ((prevPageKey != null) || (nextPageKey != null))
    };

    // send JSON to Mustache
    var html = mu.to_html(templates['list.mu'], postList);

    // write HTML to response stream
    response.writeHead(200, { "Content-Type" : "text/html" });
    response.end(html);
    return;
  });
}
````
