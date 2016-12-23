---
layout: article_page
title:  Supported languages
excerpt: "Guides to building an algorithm in your favorite language including: Python, R, Scala, Rust, Java, Ruby and JavaScript."
date:   2016-05-16 14:28:42
permalink: /algorithm-development/languages/
redirect_from:
  - /algorithm-development/client-guides/
  - /algorithm-development/guides/
categories: algorithm-development
tags: [algo-guide-overview]
show_related: false
author: steph_kim
image:
    teaser: /icons/Algorithmia_Microservices.png
---

As an Algorithmia user, in addition to having access to hundreds of algorithms, you also have the ability to add your own algorithms. You can write a private algorithm for your own use, contribute an open source algorithm, or monetize an algorithm you authored. Our algorithms and platform are designed with composability in mind, so think of algorithms in the marketplace as building blocks.

We currently support algorithm development in Java, Scala, Python, Ruby, Rust and JavaScript but we are working on expanding this list. If you have algorithm code you'd like to host on the Algorithmia platform in a different language, please <a href="mailto:support@algorithmia.com">get in touch</a>! We are able to host executables in some special cases.

### Using Git

Behind the scenes, Algorithmia uses git to manage source code. Checkout <a href="/algorithm-development/git-support/">this guide</a> to learn more.

### Supported Languages
{% assign lang_tags = "algo-guide-lang" | split:"|" %}
<div>
  {% for post in site.posts %}
  	{% if lang_tags == post.tags %}
  		<div class="col-xs-3 lang-tile">
	      	<a  href="{{ post.url }}">
		      	{% if post.image.teaser %}
		  			<img  src="{{ site.url }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
				{% endif %}
			</a>
			<p><a  href="{{ post.url }}">{{ post.title }}</a></p>
		</div>
	{% endif %}
  {% endfor %}
</div>
