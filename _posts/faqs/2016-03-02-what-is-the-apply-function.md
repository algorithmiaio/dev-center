---
layout: faq
title:  "What is the apply() function?"
date:   2016-03-02 15:00:38
categories: faqs
tags: [algo-dev-faq]
show_related: true
author: liz_rush
image:
  teaser: /icons/fa-question-circle.png
---


The `apply()` function defines the input point of the algorithm. We use the `apply()` function in order to make different algorithms standardized. This makes them easily chained and helps authors think about designing their algorithms in a way that makes them easy to leverage and predictable for end users.

Every algorithm must implement the `apply()` function. When you author a new algorithm, you'll find that the in browser editor comes pre-populated with the `apply()` function, as well as some comments to help guide you as you develop.

There are some differences between the way the function can be implemented in Java and Python while you are developing your algorithm.

### Java & Scala:

When you start developing an algorithm in either Java or Scala, you will find the following pre-populated in your algorithm editor:

{% highlight java lineanchors %}
/**
 * This class defines your algorithm, and its input/output.
 * Algorithms must define at least one apply(...) method.
 *
 * Examples:
 *   public int apply(int[][] array) {...}
 *   public String apply(Map<String,String> object) {...}
 *   public List<Double> apply(double a, double b, double c) {...}
 */
public class test {
    // The input and output of apply() automatically turns into JSON
    public String apply(String input) throws Exception {
        // Your algorithm code goes here
        return "Hello " + input;
    }
}

{% endhighlight %}

Java supports multiple overloaded apply methods as well as supports multiple input arguments. In order to map the input into Java objects, we use GSON to try to parse the JSON into the expected input type.

In the case of overloaded apply methods, we iterate over each apply method one by one to see if the JSON matches the expected input. If it can be de-serialized into the input for a given apply method, we then execute that apply method.

Caution! This *can* lead to ambiguity when the JSON matches multiple apply methods, for example, a number which can be coerced to match an apply method that takes a string.
{: .notice-danger }

Java supports multiple input arguments, so that when running an algorithm with a JSON list input, the algorithm will then split the input into respective arguments. With the example JSON input of `["foo", "bar"]`, the input would be mapped into first and second arguments to an apply method with a signature of `apply(String a, String b)`, such that `a = "foo"` and `b = "bar"`.

### Python

When you start writing a new algorithm in Python, you'll find the following in your editor:

{% highlight python lineanchors %}
# This module defines your algorithm, and its input/output.
# You must define an apply function that takes exactly one input.
# The input and output of apply() automatically turns into JSON.
#
# Examples:
#   def apply(array):
#   def apply(str):
#   def apply(x):
{% endhighlight %}

Because Python is not a typed language, we are more limited in the parsing we can do. As a result, the input for a Python algorithm is *always* a single argument. This single input represents the JSON exactly as it comes out of the `json.loads()` method; as such JSON lists become Python lists, JSON objects become Python dictionaries, and so on.

Overloaded apply functions are not allowed in Python.
{: .notice-warning }
