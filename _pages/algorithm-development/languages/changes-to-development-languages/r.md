---
layout: article
title:  "Changes to R Development"
excerpt: "Build your algorithm in JaRva"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: james_sutton
image:
    teaser: /language_logos/r.svg
---

We've been making some big changes to the algorithm development experience
to make development experiences stable and standard across languages. At Algorithmia, we feel that you shouldn't be forced to use a language that you're not comfortable with, to get the support that you need.

That being said, lets explore how R algorithms are implemented today, and how that experience will change.


## Existing Method

Lets look at the primary algorithm file, in this case `hello.r`.


```
library(algorithmia)

# API calls will begin at the algorithm() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
algorithm <- function(input) {
    paste("hello", input)
}
```

Lets explore what's the old method did, and what's changing:

- The primary file was named after the algorithm, in this case `hello.r`.
- `apply` is a keyword in R, so there is a free function that is defined called `algorithm`.
- The algorithm author implements a single free method (potentially overloaded) called `algorithm`.
- This function takes arbitrary types as inputs and outputs.
- The `algorithm` method was then read when an algorithm was compiled and run on Algorithmia, but was very challenging to be able to debug locally.

All of these systems will be changing going forwards, lets look at an example of the new algorithm development experience.

## New Method

```
library(algorithmia)
# API calls will begin at the algorithm() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages

algorithm <- function(input, loaded) {
  paste("hello", input)
  paste(loaded)
}



load <- function() {
  # Here you can optionally define a function called when the algorithm is loaded.
  # A great example would be any model files that need to be available to this algorithm
  # during runtime.
  # Any variables returned here, will be passed as the secondary argument to your 'algorithm' function
  loaded <- "Loaded"
  loaded
}

# This code turns your library code into an algorithm that can run on the platform.
# If you intend to use loading operations, remember to pass a `load` function as a second variable.
algo <- getAlgorithmHandler(algorithm, load)
# The 'serve()' function actually starts the algorithm, you can follow along in the source code.
algo$serve()
```

So what's changed? Lets break it down.

- The `algorithm` method is the same, but now we have an additional `load` method that can be defined.
    - `load` is a free method that lets you control what kind of functions get executed when an algorithm is loaded into a slot, as opposed to an API request.
- There is now a new block of code at the bottom of your algorithm that "handles" your implemented methods, and actually runs them on your local system.

