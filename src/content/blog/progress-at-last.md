---
slug: "progress-at-last"
title: "Progress at Last"
author: "Mikael Lofjärd"
dateTime: 2012-05-07T21:33:26+02:00
theme: "code"
tags: [
  "linux",
  "bash"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Sometimes you need more than your operating system gives you.

That's when a text editor comes in handy.

````bash
#!/bin/bash

EXPECTED_ARGS=2
E_BADARGS=65
E_BADPATH=66

if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: `basename $0` {source} {dest}"
  exit $E_BADARGS
fi

if [[ ! -f "$1" ]]; then
	echo "Source file does not exist or is not a regular file."
	exit $E_BADPATH
fi

DESTSIZE=`du -b "$1" | awk '{print \$1; }'`

DESTFILENAME=`basename "$1"`

if [[ -d "$2" ]]; then
	DESTPATH="$2/$DESTFILENAME"
else
	DESTDIR=`dirname "$2"`
	if [[ ! -d "$DESTDIR" ]]; then
		echo "Dest dir does not exist."
		exit $E_BADPATH
	fi
	DESTPATH="$2"
fi


cat "$1" | pv -s $DESTSIZE -p -e -r > "$DESTPATH"

exit 0
````

Copying large files to my NAS becomes so much more fun when I actually KNOW that it's doing what it should. Progress bars FTW!

UPDATE: Now it's actually working for more than one case. :)
