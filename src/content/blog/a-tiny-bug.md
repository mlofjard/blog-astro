---
slug: "a-tiny-bug"
title: "A Tiny Bug"
author: "Mikael Lofjärd"
dateTime: 2011-12-10T00:20:31+01:00
theme: "code"
tags: [
  "javascript",
  "bugs"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
I've been using (and still am in production) an old JavaScript function called `parseInt` when parsing my DateTimes for comments and posts. For some reason it showed some weird behavior today.

I noticed a comment that was written on December 0. I looked it up in the database and it turns out it was actually written on December 8. Now the 8 should have been parsed from the DateTime `2011-11-08 ...` into the string `"08"` and then I assumed `parseInt` should have gotten rid of that extra 0 for me.

I found my problem in the `parseInt` documentation over at w3schools.

> The parseInt() function parses a string and returns an integer.
>
> The radix parameter is used to specify which numeral system to be used, for example, a  radix of 16 (hexadecimal) indicates that the number in the string should be parsed  from a hexadecimal number to a decimal number.
>
> If the radix parameter is omitted, JavaScript assumes the following:
>
> If the string begins with "0x", the radix is 16 (hexadecimal)  
> If the string begins with "0", the radix is 8 (octal). This feature is deprecated  
> If the string begins with any other value, the radix is 10 (decimal)  

`parseInt` works fine for the strings "01" through "07" and of course for any string beginning with a "1". The deprecated "string begins with a zero"-feature was the culprit.

So today I learned something new; use `Number()` instead.
