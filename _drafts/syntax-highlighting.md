---
layout: article
title: "How to display code in your post"
categories: example
excerpt: "Demo post to test the various ways of using syntax highlighting."
date: 2016-01-05 15:00:00
---

## Syntax Highlighting for Code Blocks

Use the following format to start a syntax highlighted code block, with your language of choice as the first parameter.

{% highlight css %}
{% raw %}
{% highlight scala %}
...
your code here
...
{% endhighlight %}
{% endraw %}
{% endhighlight %}


You can also pass in the parameter of `linenos` to include line numbers, e.g.:

{% highlight css %}
{% raw %}
{% highlight scala linenos %}
...
your code here
...
{% endhighlight %}
{% endraw %}
{% endhighlight %}



To modify styling & highlight colors edit `/assets/less/pygments.less` and compile `main.less` with your favorite preprocessor. Or edit `main.css` if that's your thing, the classes you want to modify all begin with `.highlight`.

Find the list of supported languages [here](http://pygments.org/languages/). 

**Examples:** 

CSS:

{% highlight css %}
#container {
    float: left;
    margin: 0 -240px 0 0;
    width: 100%;
}
{% endhighlight %}

HTML with line numbering enabled:

{% highlight html linenos %}
{% raw %}
<nav class="pagination" role="navigation">
    {% if page.previous %}
        <a href="{{ site.url }}{{ page.previous.url }}" class="btn" title="{{ page.previous.title }}">Previous article</a>
    {% endif %}
    {% if page.next %}
        <a href="{{ site.url }}{{ page.next.url }}" class="btn" title="{{ page.next.title }}">Next article</a>
    {% endif %}
</nav><!-- /.pagination -->
{% endraw %}
{% endhighlight %}


Ruby:

{% highlight ruby %}
module Jekyll
  class TagIndex < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      tag_title_prefix = site.config['tag_title_prefix'] || 'Tagged: '
      tag_title_suffix = site.config['tag_title_suffix'] || '&#8211;'
      self.data['title'] = "#{tag_title_prefix}#{tag}"
      self.data['description'] = "An archive of posts tagged #{tag}."
    end
  end
end
{% endhighlight %}

### Not the right output?

You might have to use the `{{ "{% raw " }}%}` & `{{ "{% endraw " }}%}` tags to prevent the templating engine from trying to process the code in your block. See the above HTML example for `raw` usage. 

## Gists

You can also embed a gist in the page if you'd like to display the code that way. This can be helpful if you have a collection of various code files and want to keep them all in one place.  

To embed a gist, simply use the templating engine's built in capabilities with the tag  `{{ "{% gist c2b019a35fb0dc07d6fa " }}%}`:

{% gist c2b019a35fb0dc07d6fa %}


### Code highlighting & gists

For posts that are code heavy, consider putting all relevant code into a gist with as many files as you need. Then you can embed the gist to have the entire code sample and use the in-text highlighting for short blocks of code that you are directly discussing to avoid overwhelming the reader.
