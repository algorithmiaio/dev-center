---
escape_code: true
escape_raw: true
---

Some text

```
 `stuff`
Some kind of example:
    {% some tag that should break %}
Stuff!
```
guys!

Testing the ``double {% _guys_ seriously? %} ` type`` of code thing.

The random tab character below shouldn't trigger an escape.
	
So here's a `{% nonexistant tag %}` that should be escaped.

{% highlight html %}
Some kind of example:
{% some tag that should break %}
Stuff!
{% endhighlight %}


{% codeblock html %}
Some kind of example:
    stuff
{% some tag that should break %}
Stuff!
{% endcodeblock %}
    stuff
    {% foo %}
some text

	{% highlight html %}{% raw %}
	<article>{{ post.content }}</article>
	{% endraw %}{% endhighlight %}

Test inner space block raw replacement:

    This inline {% raw %}`<code>`{% endraw %} tag is escaped.
