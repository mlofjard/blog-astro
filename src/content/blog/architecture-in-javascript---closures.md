---
slug: "architecture-in-javascript---closures"
title: "Architecture in JavaScript - Closures"
author: "Mikael Lofjärd"
dateTime: 2011-12-06T22:53:30+01:00
theme: "code"
tags: [
  "architecture",
  "javascript"
]
pictureUrl: null
pictureSubText: null
pictureAltText: null
draft: false
---
Today is Tuesday, which for me means I've held another tutorial at work. Today it was less hands-on and more of me just talking and showing examples on the projector using the wonderful [jsfiddle](http://jsfiddle.net/) JavaScript quick-hack-tool.

My talk today was mostly about closures, so I thought I should write something here on the subject as well.

I find that it's not that easy to explain closures using just words, but if I were to try it would go something like this.

* A closure is a functions variable scope that still exists after the function has executed.
* A closure only exist as long as something else has a reference to something that needs it.
* A closure is created when an outer function has inner functions.

If you have no idea what I meant with any of that, then I hope these examples will clear things up: (I know they did for me)

## Example 1

````js
function saySomeThing(something) {
  var text = 'Hello ' + something;
  var innerFunction = function () {
    alert(text);
  };
  return innerFunction;
}

var say = saySomeThing('World');
````

When `saySomeThing('World')` is called, it returns an inner function. A closure is created that lets `innerFunction` access the `text` variable even after `saySomeThing` has finished executing.

If we were to run `say();` after this it would popup an alert with the text <samp>Hello World</samp>.

Now, if you're used to languages without closures, it would be easy to think that `innerFunction` has been "pre-compiled" into `alert('Hello World');` but that is not the case. In fact, if we were to run `say.toString();` the output would be <samp>function () { alert(text); }</samp> even though our `say` variable is clearly not in the same scope as `text`. But it works because the function pointer to `innerFunction` that `saySomeThing` returns contains a reference to the closure created when we executed `saySomeThing('World');`.

Every call to `saySomeThing` would create a new closure. If the old closure is no longer referenced, for example if we were to run `say = saySomeThing('Goodbye');` then the old closure previously reference by the <code>say</code> variable would be garbage collected.

## Example 2

````js
var AlertNumber, IncreaseNumber, SetNumber;

function setupGlobals() {
  var num = 10;

  AlertNumber = function () { alert(num); }
  IncreaseNumber = function () { num++; }
  SetNumber = function (x) { num = x; }
}
````

In the above code, every call to `setupGlobals` would create a new closure and thus create a new `num` variable with the value <samp>10</samp>, but a call to `IncreaseNumber` would reference the current closure and increase the internal `num` variable by 1.

## Closures in C#

A question that I got today was: "What other languages uses closures?". I know there are a few I've read about somewhere on the internet but I couldn't really name them right there and then.

But then on my way home I started thinking about C# and I had an idea. Wouldn't closures be possible now that C# has anonymous functions (lambdas), anonymous objects and the Action<> and Func<> types? And it is. If I would have googled it instead of trying for myself I would have found that out in about 2 seconds, but where's the fun in that?

````csharp
public object Closure()
{
  var number = 10;

  Action showNumber = () => MessageBox.Show(number.ToString());
  Action increaseNumber = () => number++;
  Action<int> setNumber = (i) => number = i;
  return new { showNumber, increaseNumber, setNumber };
}

dynamic a = Closure();
````

This is almost the same example as before, but in C#. If we were to call `a.showNumber()` it would show a message box with the value <samp>10</samp> in it. And it would increase `number` by 1 every time we call `a.increaseNumber()`. It also creates a new closure every time we call `Closure()`.

In C# this same functionality would probably be easier to understand if turned into a class instead, but having a deeper understanding about how closures work is almost a requirement if you're going to do any kind of serious JavaScript development. At least that is my opinion.
