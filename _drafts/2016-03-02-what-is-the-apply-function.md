layout: article
title:  "What is the apply() function?"
date:   2016-03-02 15:00:38
categories: faqs
tags: [algo-dev, faq]
show_related: true
author: liz_rush
image:
  teaser: /icons/fa-bolt.png
---

The apply function defines the input point of the algorithm. There are some irreconcilable differences between apply in different languages.

Java/Scala: supports multiple "overloaded" apply methods, and also supports multiple argument inputs. In order to map the input JSON into arbitrary Java Objects, we use Gson to try and parse JSON into the expected input type. In the case of overloaded apply methods, we go through each apply method one by one and see if the JSON matches the expected input. If the JSON can be de-serialized into the input for a given apply function, we execute that apply function. Caution: this CAN lead to ambiguity when JSON can match multiple apply functions (for example, numbers can be coerced to match an apply function that takes a string).

Multi argument inputs take a JSON list, and split it into the respective arguments. So a JSON input of ["foo","bar"] would get mapped into the first and second arguments to apply(String a, String b), such that a = "foo" and b = "bar".

Python: Is not a typed language, and so we are more limited in what parsing we can do. As a result, the input is ALWAYS a single argument representing the JSON exactly as it comes out of json.loads(). JSON lists become python lists, JSON objects become python Dicts, etc. Overloaded apply functions are NOT allowed.

JavaScript: similar to python, JSON gets passed in as the first argument to apply (regardless of whether its a list or whatever). Overloading is NOT allowed in javascript.