---
layout: article
title:  "Changes to Algorithm Development"
excerpt: "how algorithm development will be changing"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: james_sutton
image:
    teaser: 
---

Algorithm development is a core part of the algorithmia experience, and we're making some changes to what algorithm developers can do, and how they write algorithm code.

This article will talk about some of the core changes at a high level, and also language specific changes that could impact your development.


# Table of Contents
- [Core Changes](#core-changes)
- [Object Oriented Languages](#obj-oriented-langs)
- [Procedural/Scripting Languages](#script-langs)
- [Appendix](#appendix)
    - [Java](#java)
    - [Scala](#scala)
    - [Python](#python)
    - [R](#r)

# Core Changes
We've been hard at work looking to standardize and simplify the algorithm development experience across languages. 

Our goal has been broader than just consistency, though. We also want to expand the tools we provide to algorithm developers, and by extension algorithm consumers by making available new features/functionality within algorithms.

## Local Algorithm Testing

### TODO: put image here

Previously, algorithms were kind of black boxes with an "apply" function that we wrapped some magic around on our end; however it was never really possible to actually see how that magic worked.
This made things really easy to get started, but hid a lot of potential pitfalls when it comes to developing real production ready algorithms that need to be reliably tested and debugged.

To rectify this, we're changing how algorithms are run. From now on, algorithms are executable - this means that if you want to see exactly how your algorithm works on our platform, we're now building a recipe to let you do that.

### TODO: Run algorithm locally tutorial (needs dockerhub image work?)

## Algorithm Development Helper Functions

### TODO: put image here

Algorithm development has typically been a very manual affair when it comes to diagnostics, logging or other auxillary tasks other than creating a functioning Algorithm.
The 'Apply' function has been the all-in-one function to handle requests from end-to-end, but sometimes there are critical events that need to be handled outside of that relatively simplistic loop.

To start, we're introducing the `load()` function as an optional method algorithm developers can implement. 

### TODO: load function picture

When you define a load function, any code or paths you describe inside will get executed _before_ any algorithm requests actually get sent to the worker container. The typical use would be for when you need to download model files / binaries from the Data API before doing any work, and you don't want to download those same files on each API request.

This simplifies the workflow for Scripting Languages like Python/R, and help Object Oriented Languages like Java/Scala reach feature parity.


## Open Source Guts

Algorithmia has always been closely tied to the Open Source community; we've exposed large swaths of our product to the public as a way for our users to provide feedback and let us know if anything is missing in our documentation. 
Even this document itself can be viewed and interacted with on github, however we've always wanted to migrate more of the core user facing features to public repositories.

When implementing the changes to the algorithm execution and development experience, we decided to migrate that functionality into our existing algorithm clients.
We did this for two reasons: 
- A) We wanted to ensure users could view and understand the underlying code that's being used to execute their algorithm without anything hindering their understanding.
- B) We also wanted to provide an outlet/entrypoint for algorithm developers who'd like to enhance the algorithm experience by suggesting or testing out new features and be more involved in helping make the Algorithmia platform even better.

To that end, we believe that making sure all algorithm execution logic is public and easily discoverable will help us get to a world where users are able to build their own algorithm tooling around Algorithmia.

Here's a list of clients already updated:
- [Java Client](https://github.com/algorithmiaio/algorithm-handler-java)
- [Scala Client](https://github.com/algorithmiaio/algorithmia-scala)
- [R Client](https://github.com/algorithmiaio/algorithmia-r)
- [Python Client](https://github.com/algorithmiaio/algorithmia-python)



# Object Oriented Languages

Object Oriented languages like Java and Scala will be using a new Abstract class implementation system.
The Algorithm developer will implement this class, optionally overriding functions such as `load()` if desired - and then passing the class as a parameter to a new AlgorithmHandler pattern.

Passing information between the `load` and `apply` functions is done by updating a mutable class variable, in the example below that's called `something`, but can be user defined.
Lets take a look at an example below:
```
package com.algorithmia.algorithm;

import com.algorithmia.development.*;
import com.algorithmia.*; 

// This class defines your algorithm.
class Algorithm extends AbstractAlgorithm<String, String>{

    // This class defines the input to your algorithm, the algorithmia platform will attempt to deserialize JSON into this type.
    // This variable is an example of something you can set within a "load()" function that can be accessible at runtime.
    private String something = "Not Loaded";


    // This apply function defines the primary motive driver of your algorithm. Please ensure that the types defined in
    // your algorithm are the same as those defined in as generic variables in your concrete class defined above.

    public String apply(String input){
        return "Hello " + input + ", it's " + something;
    }

    // This is an example of how you can override the load() function and update a class member to pass information to runtime,
    @Override
    public void load() {
        something = "Loaded";
    }

    public static void main(String[] args) {
        Algorithm algorithm = new Algorithm();
        Handler algo = new Handler<>(algorithm);
        algo.serve();
    }
}
```


# Procedural/Scripting Languages
Procedural or Scripting languages like Python, R, and Ruby don't typically implement interfaces or classes, so we use a different system here.
Instead, algorithm developers will implement free functions such as apply, and pass that as a parameter to our AlgorithmHandler class.

Passing information between the `load` and `apply` functions is different from Object Oriented systems, if you're implementing `load`, you need to return it as an output. Your apply function will also need to take it as a second input as well.
Lets take a look at a python example below:

```
import Algorithmia
# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages

def apply(input, context=None):
    if context:
        output = "hello {}, it's {}".format(input, context)
    else:
        output = "hello {}, it's Not Loaded".format(input)
    return output
    
    
def load():
    # Here you can optionally define a function that will be called when the algorithm is loaded.
    # The return object from this function can be passed directly as input to your apply function.
    # A great example would be any model files that need to be available to this algorithm
    # during runtime.
    # Any variables returned here, will be passed as the secondary argument to your 'algorithm' function


    return "Loaded"

# This code turns your library code into an algorithm that can run on the platform.
# If you intend to use loading operations, remember to pass a `load` function as a second variable.
algo = Algorithmia.handler(apply, load)
# The 'serve()' function actually starts the algorithm, you can follow along in the source code
# to see how everything works.
algo.serve()
```


That's the basics of the changes that we've made, below is a list of complete changes/modifications to each language.
If you have any questions or comments please feel free to reach out via support@algorithmia.com, or by filing an issue on github.


# Appendix

## Java

## Scala

## Python

## R
