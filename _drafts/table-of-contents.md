---
layout: article
title:  "Make a Table of Contents"
date:   2016-01-05 11:39:38
categories: example
author: liz_rush
---

{% include toc.html %}

Make a table of contents on your post for easy navigation.

Simply place the following at the top of your post:
{% raw %}
{% include toc.html %}
{% endraw %}

This will find all h2 tags (or `##` in markdown) and automatically turn them into sections in your table of contents. 

While it can also pick up h1 tags, this is not recommended because the title of the page is the h1. h1 tags will make the styling of the ToC wonky, as well as being a generally bad practice for web development.

It is automatically labeled as "Overview", but this can be configured in the `_data/messages.yml` file if needed.


## Section One

Here's some stuff!

## Section Two

Here's more stuff! You can quick jump to these sections by clicking the headers in the table of contents at the top!

## Wrapping up

Conclusions and whatnot.
