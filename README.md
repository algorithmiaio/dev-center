[![Build Status](https://api.shippable.com/projects/56a12f721895ca447472408e/badge/master)](https://app.shippable.com/projects/56a12f721895ca447472408e/builds/latest)

Algorithmia Developer Center
========

Welcome to the repository for Algorithmia's Developer Center. Here you will find guides, tutorials, sample apps, as well as some documentation on getting started with the API and basic set up.

These docs are built on Jekyll. Learn more over at [the official Jekyll page](http://jekyllrb.com/).

Running locally
------------------------------

### Prerequisites

You're going to need:

 - **Linux or OS X** — Windows may work, but is unsupported.
 - **Ruby, version 1.9.3 or newer**
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.

### Getting Set Up

 1. Fork this repository on Github.
 2. Clone *your forked repository* with `git clone https://github.com/YOURUSERNAME/dev-center.git`
 3. `cd dev-center`
 4. Install all dependencies: `bundle install`. If you are having trouble with some of the gems, try running `bundle update`, then run `bundle install` again.
 5. Start the test server: `bundle exec jekyll serve`

You can now see the developer center at <http://localhost:4000>.


Making changes
-------------

###Project Organization

All posts, layouts, includes, stylesheets, assets, and whatever else is grouped nicely under the root folder. 

Find all posts under the `_posts` directory.

The compiled Jekyll site outputs to _site/.


### Writing Posts

The first thing that goes in each new post is the [YAML front-matter](http://jekyllrb.com/docs/frontmatter/). Below is an example of front-matter:

```ruby
---
layout: article
title:  "Example post!"
excerpt: "This is an example post."
date:   2016-01-05 11:39:38
categories: guides example
author: liz_rush

tags: [stuff, things]
show_related: true # show sidebar of posts with same tags

# optional fields:
exclude_from_search: true #false by default
comments: false #true by default but currently disabled in config
share: false #true by default
sitemap: false #true by default
---
```

For our purposes, the minimum you will need is `layout`, `title`, `date`, & `categories`. The other fields only need to be present if you are overriding the default. 

Use `excerpt` to set the text that appears in under the article title in the view of all articles. The template will automatically grab the first sentence if you do not set an excerpt, so you'll want to make sure that is appropriate or set one by hand. Note: If the first line of your post is a templating tag, it will not automatically pick up an excerpt. 

In the case of `author`, the default author can be found in `_config.yml`. The default author is Algorithmia. If you need to add yourself as an author, please fill out your author data in `_data/authors.yml`. Then, set the author field in your front-matter in the post. 

Posts are organized according to category as a subdirectory of `_posts`. Each post follows the same naming convention: `YYYY-MM-DD-post-title.md`.

Here is an example:
```ruby
_posts/guides/2016-01-05-example-post.md
```


If you are unfamiliar with Jekyll and the templating engine, please take a look at the `_drafts` folder for instructions on how to view drafts as well as many sample posts explaining how to do common tasks. 


Contributing
-------------

First, fork the repository and follow the instructions above to get set up. Make sure all your changes work locally. When you are ready, make a pull request to this repo and we will review the changes. Be sure to describe the changes, attach screenshots of any cosmetic changes, and if applicable, link to the open issue.


Need Help? Found a bug?
----------------

If you find a bug, can't follow the documentation or have a question – [submit an issue!](https://github.com/algorithmiaio/dev-center/issues)

We will respond to you or reach out for more information as soon as possible. And, of course, feel free to submit pull requests with bug fixes or changes.