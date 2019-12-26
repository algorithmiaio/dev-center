---
layout: article
title:  "Changes to Java Development"
excerpt: "Build your algorithm in Java"
categories: languages
tags: [algo-guide-lang]
show_related: true
author: james_sutton
image:
    teaser: /language_logos/java.svg
---


We've been making some big changes to the algorithm development experience
to make development experiences stable and standard across languages. At Algorithmia, we feel that you shouldn't be forced to use a language that you're not comfortable with, to get the support that you need.

That being said, lets explore how Java algorithms are implemented today, and how that experience will change.


## Existing Method

Lets look at the primary algorithm class, in this case - it's called `hellojava.java`.
```
package algorithmia.hellojava;

import com.algorithmia.*;
import com.algorithmia.algo.*;
import com.algorithmia.data.*;
import com.google.gson.*;
import java.util.*;

public class hellojava {
    public String apply(String s) throws Exception {
        return "Hello " + s;
    }
}

```

Lets explore what's the old method did, and what's changing
- The primary file was named after the algorithm, in this case `hellojava.java`, and the primary class was named the same.
- The user implements a single method (potentially overloaded) in the primary class called `apply`.
- This function takes arbitrary types as inputs and outputs, but it is not possible to define mandatory fields, optionals etc.
- The apply method was then read when an algorithm was compiled and run on Algorithmia, but was very challenging to be able to debug locally.

All of these systems will be changing going forwards, lets look at an example of the new algorithm development experience.

## New Method

```
package com.algorithmia.algorithm;

import com.algorithmia.development.*;
import com.algorithmia.*; 
// This class defines your algorithm.
class Algorithm extends AbstractAlgorithm<Algorithm.ExampleInput, String>{

    // This class defines the input to your algorithm, the algorithmia platform will attempt to deserialize JSON into this type.

    class ExampleInput {
        //If you flag a field with the @Required annotation, we will only validate the deserialization operation if the field is present.
        @Required String first_name;
        //If the @Required annotation is not present, then we will use the default / null value for that type if the field isn't present, consider it "optional".
        String last_name;
        ExampleInput(String first_name, String last_name){
            this.first_name = first_name;
            this.last_name = last_name;
        }
    }
    // This variable is an example of something you can set within a "load()" function that can be accessible at runtime.
    private String something = "Not Loaded";


    // This apply function defines the primary motive driver of your algorithm. Please ensure that the types defined in
    // your algorithm are the same as those defined in as generic variables in your concrete class defined above.

    public String apply(ExampleInput input){
        if(input.last_name != null){
            return "hello " + input.first_name + " " + input.last_name + " : " + something;
        }
        else {
            return "hello " + input.first_name + " : " + something;
        }
    }

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

So what's changed? Lets break it down:
```
class Algorithm extends AbstractAlgorithm<Algorithm.ExampleInput, String>{
```
- The primary algorithm file is now called Algorithm.java, and the primary class is also Algorithm, simplifying algorithm reading and understanding.
- The class now extends an [Abstract Class](https://github.com/algorithmiaio/algorithm-handler-java/blob/master/src/main/java/com/algorithmia/development/AbstractAlgorithm.java) that contains virtual methods that may be implemented, one of those is the `apply` function.
```

class Algorithm extends AbstractAlgorithm<Algorithm.ExampleInput, String>{

    // This class defines the input to your algorithm, the algorithmia platform will attempt to deserialize JSON into this type.

    class ExampleInput {
        //If you flag a field with the @Required annotation, we will only validate the deserialization operation if the field is present.
        @Required String first_name;
        //If the @Required annotation is not present, then we will use the default / null value for that type if the field isn't present, consider it "optional".
        String last_name;
        ExampleInput(String first_name, String last_name){
            this.first_name = first_name;
            this.last_name = last_name;
        }
    }
    // This variable is an example of something you can set within a "load()" function that can be accessible at runtime.
    private String something = "Not Loaded";


    // This apply function defines the primary motive driver of your algorithm. Please ensure that the types defined in
    // your algorithm are the same as those defined in as generic variables in your concrete class defined above.

    public String apply(ExampleInput input){
        if(input.last_name != null){
            return "hello " + input.first_name + " " + input.last_name + " : " + something;
        }
        else {
            return "hello " + input.first_name + " : " + something;
        }
    }

    @Override
    public void load() {
        something = "Loaded";
    }

```
- The abstract class contains virtual methods, like `apply()`, which is mandatory - but also others such as `load()`. This new system provides more expressivity and extendability in the future.
- They also abstract some order of operations and functionality in a way that maintains developer freedom, while still being able to see what's under the hood.
- `load()` which is optional, can be used to set variables once when the algorithm container loads; this can be very useful when you need model files or tools from outside of your algorithm's source code.


Besides the changes to the apply method and algorithm class, the actual execution logic itself is now designed to be implemented in the algorithm!
 This allows you to run your code and actually see how it will run within an Algorithmia runtime environment.
```
    public static void main(String[] args) {
        Algorithm algorithm = new Algorithm();
        Handler algo = new Handler<>(algorithm);
        algo.serve();
    }
}
```
For now, this execution code doesn't provide a debuggable interface; it explicitly runs code as it would if it was found inside of an algorithmia job container. 
However in the future we'll be looking to improve this experience even further, and provide a mechanism to run an Algorithm locally to ensure you can get the optimal testing experience.
