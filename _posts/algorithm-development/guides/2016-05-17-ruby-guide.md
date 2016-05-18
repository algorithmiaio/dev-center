---
layout: article
title:  "Ruby Algorithm Development"
excerpt: "Build your algorithm in Ruby"
date: 2016-05-17  09:50:46
permalink: /algorithm-development/guides/ruby-guide
tags: [algo-guide-lang]
show_related: true
author: liz_rush
---


Algorithmia supports algorithm development in Ruby.

#### Available APIs

Algorithmia makes a number of libraries available to make algorithm development easier.
The full <a href="http://ruby-doc.org/core-2.2.0/">Ruby 2.2 language and standard library</a>
is available for you to use in your algorithms. Furthermore, algorithms can call other algorithms and manage data on the Algorithmia platform
via the <a href="http://developers.algorithmia.com/clients/ruby/">Algorithmia Ruby Client</a>.

#### Managing Dependencies

Algorithmia supports adding 3rd party dependencies via <a href="https://rubygems.org/">Ruby Gems</a> using a Gemfile. On the algorithm editor page, click Options and select Manage Dependencies.

Add dependencies by adding the package name to the `Gemfile`.

Note that you will still need to include an import statement to your algorithm file. For example, to make use of nokogiri, you would include the line

`gem "nokogiri"`

in the dependencies file and the line

`require "nokogiri"`

in the main file.

#### I/O for Your Algorithms:

Datatypes that are either sequences that you don't wish to iterate over such as strings, or inputs that are scalar in nature such as numeric data types can be accessed via input, however you will probably want to check for the data type you are expecing to receive.

{% highlight ruby %}
import Algorithmia

def apply(input)
    input.instance_of? String
    return input
end
{% endhighlight %}

A string input:

{% highlight ruby %}
input_string = "Ruby is such a gem!"
{% endhighlight %}

Inputs that are sequences such as: strings, arrays, hashes or a ASCII-8BIT string of binary data (such as an image file) can be handled as you would any Ruby sequence. For example:

{% highlight ruby %}
import Algorithmia

def apply(input):
	input.instance_of? Array
    return 'The languages that influenced Ruby: ' + input[0] + input[1] + input[2] + input[3] + input[4]
{% endhighlight %}

Here is an example of an array input:

{% highlight ruby %}
input_array = ["Perl", "Smalltalk", "Eiffel", "Ada", "Lisp"]
{% endhighlight %}

Which will return:

`"The languages that influenced Ruby: Perl, Smalltalk, Eiffel, Ada, Lisp"`

When you are creating an algorithm that takes input from other algorithms it's important to understand the data types your algorithm ingests and be thoughtful of the data types you output that others will ingest as input.

#### Calling Other Algorithms and Managing Data

To call other algorithms or manage data from your algorithm, use the [Algorithmia Ruby Client](#ruby-client) which is automatically available to any algorithm you create on the Algorithmia platform.

When designing your algorithm, don't forget that there are special data directories, `.session` and `.algo`, that are available only to algorithms to help you manage data over the course of the algorithm execution.

#### Error Handling

{% highlight ruby %}
raise NameError('Invalid graph structure')
{% endhighlight %}

Exceptions will be returned as JSON, of the form:

{% highlight json %}
{
  "error": {
    "message": "Error running algorithm",
    "stacktrace": ...
  }
}
{% endhighlight %}

Algorithms can throw any exception, and they will be returned as an error via the Algorithmia API. If you want to throw a generic exception message, use an `AlgorithmException`.

#### Additional Resources

* <a href="http://developers.algorithmia.com/clients/ruby/">Algorithmia Client Ruby Docs <i class="fa fa-external-link"></i></a>
* <a href="http://ruby-doc.org/core-2.2.0/">Ruby 2.2 Docs</a>