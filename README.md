[![Run Status](https://api.shippable.com/projects/56a12f721895ca447472408e/badge?branch=master)](https://app.shippable.com/projects/56a12f721895ca447472408e)

# Algorithmia Developer Center

Welcome to the repository for Algorithmia's Developer Center. Here you will find guides, tutorials, sample apps, as well as some documentation on getting started with the API and basic set up.

These docs are built on Jekyll. Learn more over at [the official Jekyll page](http://jekyllrb.com/).

## Running locally

### Initial Setup

1. Install [Docker](https://www.docker.com/products/docker-desktop)
2. Log into Docker using the `algojenkins` account. (Password in LastPass)
3. `yarn setup`

### Normal Dev Workflow

1. `docker-compose up`
2. Visit `http://localhost:4000/developers/` or `http://localhost:4000/developers/api`

### Building images for docker-compose

If changes are made to `package.json`, `Gemfile`, or any server-related code (`server/*`, `_config-*.yml`), you'll probably want to update the docker image that docker-compose uses for local dev.

```bash
docker build --no-cache -t algorithmiahq/dev-center:local-dev-node-server -f local.node.Dockerfile .
docker push algorithmiahq/dev-center:local-dev-node-server
```

```bash
docker build --no-cache -t algorithmiahq/dev-center:local-dev-jekyll-server -f local.jekyll.Dockerfile .
docker push algorithmiahq/dev-center:local-dev-jekyll-server
```

## Submodules

The [Algorithmia API Docs](https://github.com/algorithmiaio/api-docs) are included as a submodule of this project. If you make updates in this repository that you would like reflected in the Dev Center, `cd` into the submodule directory and check out the commit with your updates. Then `cd` back to the `dev-center` directory, run `git add [submodule directory]`, and commit.

## Making changes

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

Image and video assets can be prefixed with `{{site.cdnurl}}` to automatically serve them via CDN. Note that it can take over 24h for the CDN's cache to clear, so if replacing an asset which is already in the CDN, consider renaming the asset to force its immediate reloading.

### Plugins

This Jekyll site uses several plugins to help generate content and make the site extra-awesome. All plugins live in the `plugins` directory. In order to speed up development, we've opted to use some plugins only in a production environment. You can see which plugins are used for development versus production by opening the `_plugins-dev` or `_plugins-prod` folders, which use symlinks to refer to files in the `plugins` folder.  Included in the `plugins` directory:

- `Emoji.rb`: Emojify your posts. Simply use the text version (like you would on GitHub) and this plugin will replace it with the emoji image. See the [emoji cheat sheet](http://www.emoji-cheat-sheet.com) for a full listing of emoji codes. :nail_care:
- `author_page_generator.rb`: This plugin will generate a page that lists all posts by a given author.
- `jekyll-lunr-search.rb`: __(Production Only)__ Generates the index of all posts for the search function.
- `navmenu.rb`: A tag plugin to generate the side navigation menu.
- `strip.rb`: Removes some excess whitespace and new lines generated by the Liquid templating process.

## Environment Variables

#### `ENFORCE_CSP` | Boolean

**Default**: `false`

**Description**: If set to `true`, enforces a content security policy for the application.

#### `DISABLE_HSTS` | Boolean

**Default**: `false`

**Description**: If set to `true`, disables the `Strict-Transport-Security` header on server responses.

#### `DISABLE_X_CONTENT_TYPE_OPTIONS` | Boolean

**Default**: `false`

**Description**: If set to `true`, disables the `X-Content-Type-Options` header on server responses.

#### `DISABLE_X_FRAME_OPTIONS` | Boolean

**Default**: `false`

**Description**: If set to `true`, disables the `X-Frame-Options` header on server responses.

#### `DISABLE_X_XSS_PROTECTION` | Boolean

**Default**: `false`

**Description**: If set to `true`, disables the `X-XSS-Protection` header on server responses.

#### `PROMETHEUS_TOKEN` | Boolean

**Default**: `undefined`

**Description**: The authorization bearer token necessary for the application to expose Prometheus metrics at the /metrics endpoint.

## Contributing

First, fork the repository and follow the instructions above to get set up. Make sure all your changes work locally. When you are ready, make a pull request to this repo and we will review the changes. Be sure to describe the changes, attach screenshots of any cosmetic changes, and if applicable, link to the open issue.

When contributing please refer to the [Algorithmia manual of style](https://docs.google.com/document/d/1PPVfgMkX7-EVGLPMhN1E485CAXu9QfhSLKM0lZhnZdU/edit?usp=sharing) for grammar, punctuation, voice, and tone.

## Need Help? Found a bug?

If you find a bug, can't follow the documentation, or have a question -- please [submit an issue!](https://github.com/algorithmiaio/dev-center/issues)

We will respond to you or reach out for more information as soon as possible. And, of course, feel free to submit pull requests with bug fixes or changes.
