---
layout: article_page
title:  "Data Portal Guide"
excerpt: "Host your data files or trained models on the Algorithmia platform for free."
date:   2016-06-06 11:46:03
categories: algorithm-development
nav_children: algo-data
tags: [data-connectors-overview]
show_related: false
author: steph_kim
---

As an algorithm developer you might require large data files such as trained models or other large files that your algorithm depends on. With <a href="https://algorithmia.com/data/hosted">Algorithmia's Hosted Data</a> option you can host these files on our platform for free. Plus, it's easy to integrate your data into the algorithm you're building using the Algorithmia Data API.

How easy is it? By creating an Algorithmia account you automatically have access to <a href="https://algorithmia.com/data/hosted">Algorithmia's Hosted Data</a> platform where you can store your data files or even your algorithm's output. Once you've set up your data collections our file hosting option is accessable via <a href="http://docs.algorithmia.com/#data-api-specification">Algorithmia's Data API</a>.

If you have any questions about Algorithmia please <a href="mailto:support@algorithmia.com">get in touch</a>!

### Algorithm data portal guides:
<div class="col-xs-3 lang-tile">
  {% assign pages = site.pages | where: "categories", "algo-data" %}
  {% for post in pages %}
  		<a  href="{{ post.url }}">
  		{% if post.image.teaser %}
		<img  src="{{ site.url }}{{ site.baseurl }}/images/{{ post.image.teaser }}" alt="" itemprop="image">
		{% endif %}
		</a>
		<p class="lg"><a  href="{{ post.url }}">{{ post.title }}</a></p>
  {% endfor %}
</div>
