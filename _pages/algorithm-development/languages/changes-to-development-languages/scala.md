---
layout: article
title:  "Changes to Scala Development"
excerpt: "Build your algorithm in Scala"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: james_sutton
image:
    teaser: /language_logos/scala.svg
---


We've been making some big changes to the algorithm development experience
to make development experiences stable and standard across languages. At Algorithmia, we feel that you shouldn't be forced to use a language that you're not comfortable with, to get the support that you need.

That being said, lets explore how Scala algorithms are implemented today, and how that experience will change.



## Existing Method

Lets look at the primary algorithm class, in this case - it's called `hello.scala`.
```
package algorithmia.hello
import com.algorithmia._
import com.algorithmia.algo._
import com.algorithmia.data._
import com.google.gson._

class Hello {
  def apply(input: String): String = {
    "Hello " + input
  }
}
```

Lets explore what's the old method did, and what's changing
- The primary file was named after the algorithm, in this case `hello.scala`, and the primary class was named the same.
- The user implements a single method (potentially overloaded) in the primary class called `apply`.
- This function takes arbitrary types as inputs and outputs, but it is not possible to define mandatory fields, optionals etc.
    - It used java for parsing and interoperating at the algorithm interface level, which limited types to what could be used with Java.
- The apply method was then read when an algorithm was compiled and run on Algorithmia, but was very challenging to be able to debug locally.

All of these systems will be changing, lets look at an example of the new algorithm development experience.

## New Method

```
package com.algorithmia

import com.algorithmia.handler.AbstractAlgorithm

import scala.util.{Success, Try}

class Algorithm extends AbstractAlgorithm[String, String] {

  var someVariable: Option[String] = None

  override def apply(input: String): Try[String] = {
    Success(s"hello $input: ${someVariable.getOrElse("Not Loaded")}")
  }

  override def load = Try{
    someVariable = Some("loaded")
    Success()
  }
}

object Algorithm {
  val handler = Algorithmia.handler(new Algorithm)

  def main(args: Array[String]): Unit = {
    handler.serve()
  }
}


```
So what's changed? Lets break it down:
```
class Algorithm extends AbstractAlgorithm[String, String]{
```
- The primary algorithm file is now called Algorithm.scala, and the primary class is also Algorithm, simplifying algorithm reading and understanding.
- The class, like Java - now extends an [Abstract Class](https://github.com/algorithmiaio/algorithmia-scala/blob/master/src/main/scala/com/algorithmia/handler/AbstractAlgorithm.scala) that contains virtual methods that may be implemented, one of those is the `apply` function.
```
class Algorithm extends AbstractAlgorithm[String, String] {

  var someVariable: Option[String] = None

  override def apply(input: String): Try[String] = {
    Success(s"hello $input: ${someVariable.getOrElse("Not Loaded")}")
  }

  override def load = Try{
    someVariable = Some("loaded")
    Success()
  }
}
```
- The abstract class contains virtual methods, like `apply()`, which must be implemented - but also others such as `load()`. This new system provides more expressivity and extendability in the future.
- They also abstract some order of operations and functionality in a way that maintains developer freedom, while still being able to see what's under the hood.
- `load()` can be defined by the author to set variables once when the algorithm container loads; this can be very useful when you need model files or tools from outside of your algorithm's source code.


Besides the changes to the apply method and algorithm class, the actual execution logic itself is now designed to be implemented in the algorithm, as a class object.
 This allows you to run your code and actually see how it will run within an Algorithmia runtime environment.
```

object Algorithm {
  val handler = Algorithmia.handler(new Algorithm)
  def main(args: Array[String]): Unit = {
    handler.serve()
  }
}
```
For now, this execution code doesn't provide a debuggable interface; it explicitly runs code as it would if it was found inside of an algorithmia job container. 
However in the future we'll be looking to improve this experience even further, and provide a mechanism to run an Algorithm locally to ensure you can get the optimal testing experience.
