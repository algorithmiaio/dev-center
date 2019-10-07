[![Run Status](https://api.shippable.com/projects/56a12f721895ca447472408e/badge?branch=master)](https://app.shippable.com/projects/56a12f721895ca447472408e)

Algorithmia Developer Center
========

Welcome to the repository for Algorithmia's Developer Center. Here you will find guides, tutorials, sample apps, as well as some documentation on getting started with the API and basic set up.

These docs are built on Jekyll. Learn more over at [the official Jekyll page](http://jekyllrb.com/).

Running locally
------------------------------

### Prerequisites

You're going to need:

 - **Linux or OS X** — Windows may work, but is unsupported.
 - **Ruby, version 2.3.0 or newer** - Avoid `sudo gem install` at all costs - see [rvm.io](https://rvm.io).
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.
 - **Homebrew** - If you're using a Mac, install [homebrew](https://brew.sh/) to help with the installation of imagemagick.
#### Ubuntu 16.10 Notes:

```bash
sudo apt install ruby ruby-dev zlib1g-dev
```

### Ubuntu (Xenial) on Chromebook Notes:

```sudo apt-get install g++
sudo apt-get install imagemagick
```

### Mac OSX (High Sierra) Notes:

Install imagemagick:
```
brew install imagemagick
```

Install via:
```
bundle install --path vendor/bundle
```

If installation for nokogiri fails due to libxml2 support, install it via:
```
gem install --install-dir vendor/bundle/ruby/<ruby_version_numbwe> nokogiri -v "<failing_nokogiri_version_number>" -- --with-xml2-include=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX<os_version_number>.sdk/usr/include/libxml2 --use-system-libraries
```

### Getting Set Up

 1. Fork this repository on Github.
 2. Clone *your forked repository* with `git clone https://github.com/YOURUSERNAME/dev-center.git`
 3. `cd dev-center`
 4. Make sure you have [rvm](https://rvm.io/rvm/install) and [node](https://nodejs.org/en/) installed.
 5. To set up submodules and install dependencies, run `npm run setup`.
 * **Do bear in mind that you will need to able to communicate with [GitHub via SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh) for this to function as expected.**
 * If you are having trouble with some of the gems, try running `bundle update`, then run `bundle install` again.  If `bundle` is not available, `gem install bundler`.
 6. To start both the Node and Jekyll test servers with auto-regeneration, run `npm run dev`.
 7. If you don't need auto-regeneration, you can run `npm run start` to build static dev-center files and only start the Node server.

You can now see the developer center at <http://localhost:3000/developers/>. The API docs are located at <http://localhost:3000/developers/api/>.

### Running the Jekyll Dev Server

To run only the Jekyll server at <http://localhost:4000/developers/>, first follow steps 1-5 above, then

__To Run Public Marketplace Version:__

`npm run devcenter:public`

__To Run Enterprise Version:__

`npm run devcenter:enterprise`

Making changes
-------------

### Project Organization

All posts, layouts, includes, stylesheets, assets, and whatever else is grouped nicely under the root folder.

Find all pages under the `_pages` directory, organized by URL route structure.

The compiled Jekyll site outputs to `_site/`. Do not edit anything in this directory (or your changes will be lost).


### Writing Pages

The first thing that goes in each new post is the [YAML front-matter](http://jekyllrb.com/docs/frontmatter/). Below is an example of front-matter:

```ruby
---
layout: article
title:  "Example post!"
excerpt: "This is an example post."
date:   2016-01-05 11:39:38
categories: guides example
tags: [stuff, things]

# optional fields:
exclude_from_search: true #false by default
share: false #true by default
sitemap: false #true by default
---
```

For our purposes, the minimum you will need is `layout`, `title`, `date`, & `categories`. The other fields only need to be present if you are overriding the default.

Use `excerpt` to set the text that appears in under the article title in the collection view of all articles. The template will automatically grab the first sentence if you do not set an excerpt, so you'll want to make sure that is appropriate or set one by hand. _Note:_ If the first line of your post is a templating tag, it will not automatically pick up an excerpt.

In the case of `author`, the default author can be found in `_config.yml`. The default author is Algorithmia. If you need to add yourself as an author, please fill out your author data in `_data/authors.yml`. Then, set the author field in your front-matter in the post.

### When mentioning statistics and numbers

When you're mentioning the number of algorithms in the marketplace, or the maximum number of algorithms you can call, to be consistent across the whole developer center, please use variables instead.

For example, if you want to mention the number of algorithms we have in an article, use the following:

```
And if you need a pre-trained model or utility function for your project, check out the over {{site.data.stats.marketplace.total_num_algorithms}} algorithms and microservices that have been deployed on Algorithmia's <a href="https://algorithmia.com/algorithms">AI Marketplace</a>.
```

You can find more variables in the `_data/stats.yml` file.

### CDN

Image and video assets can be prefixed with `{{site.cdnurl}}` to automatically serve them via CDN.  Note that it can take over 24h for the CDN's cache to clear, so if replacing an asset which is already in the CDN, consider renaming the asset to force its immediate reloading.

### Plugins

This Jekyll site uses several plugins to help generate content and make the site extra-awesome. Included in the `_plugins` directory:

- `Emoji.rb`: Emojify your posts. Simply use the text version (like you would on GitHub) and this plugin will replace it with the emoji image. See the [emoji cheat sheet](http://www.emoji-cheat-sheet.com) for a full listing of emoji codes. :nail_care:
- `author_page_generator.rb`: This plugin will generate a page that lists all posts by a given author.
- `jekyll-lunr-search.rb`: Generates the index of all posts for the search function.
- `navmenu.rb`: A tag plugin to generate the side navigation menu.
- `strip.rb`: Removes some excess whitespace and new lines generated by the Liquid templating process.


Contributing
-------------

First, fork the repository and follow the instructions above to get set up. Make sure all your changes work locally. When you are ready, make a pull request to this repo and we will review the changes. Be sure to describe the changes, attach screenshots of any cosmetic changes, and if applicable, link to the open issue.


Need Help? Found a bug?
----------------

If you find a bug, can't follow the documentation, or have a question -- please [submit an issue!](https://github.com/algorithmiaio/dev-center/issues)

We will respond to you or reach out for more information as soon as possible. And, of course, feel free to submit pull requests with bug fixes or changes.
