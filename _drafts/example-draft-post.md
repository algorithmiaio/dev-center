---
layout: article
title:  "Example draft post!"
date:   2016-01-05 11:39:38
categories: example
---


This is what a sample draft should look like!

Save the file and run Jekyll with the `--drafts` flag to preview your work.

{% hightlight bash lineanchors %}
$ bundle exec jekyll serve -w --drafts
{% endhighlight %}

Go back to `localhost:4000` and you should see your new post listed under today’s date. Jekyll infers the post title from the filename if none is provided, and uses the file’s last-modified date as the publication date.

Now when you’ve finished a draft and decide to publish it, the process is pretty straight forward. Move the file from _drafts to _posts, add the year formatted as YYYY-MM-DD- to the start of the filename.

Note: 

When you publish a post, if you haven't set an `excerpt` field in your front-matter, the first paragraph will be shown as the excerpt. Note that the excerpts don't process the markdown in the preview, so either ensure that you have a short & sweet `excerpt` or that the first sentence of your post does not have formatting marks.
