[![Run Status](https://api.shippable.com/projects/56a12f721895ca447472408e/badge?branch=master)](https://app.shippable.com/projects/56a12f721895ca447472408e)

# Algorithmia Developer Center

Welcome to the repository for Algorithmia's Developer Center. Here you will find guides, tutorials, sample apps, as well as some documentation on getting started with the API and basic set up.

These docs are built on Jekyll. Learn more over at [the official Jekyll page](http://jekyllrb.com/).

## Running locally

### Prerequisites

You're going to need:

- **Linux or OS X** — Windows may work, but is unsupported.
- **Ruby, version 2.4.0 or newer** - Avoid `sudo gem install` at all costs - see [rvm.io](https://rvm.io).
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

1.  Fork this repository on Github.
2.  Clone _your forked repository_ with `git clone https://github.com/YOURUSERNAME/dev-center.git`
3.  `cd dev-center`
4.  Make sure you have [rvm](https://rvm.io/rvm/install) and [node](https://nodejs.org/en/) installed.
5.  To set up submodules and install dependencies, run `npm run setup`.

- **Do bear in mind that you will need to able to communicate with [GitHub via SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh) for this to function as expected.**
- If you are having trouble with some of the gems, try running `bundle update`, then run `bundle install` again. If `bundle` is not available, `gem install bundler`.

6.  To start both the Node and Jekyll test servers with auto-regeneration, run `npm run devcenter:dev` and `npm run server:dev` in two separate terminal windows.
7.  If you don't need auto-regeneration, you can run `npm run start` to build static dev-center files and only start the Node server.
8.  To build our vue components, run `npm run vue:dev`, or if you want auto-regeneration, run `npm run vue:watch` in another terminal window.

You can now see the developer center at <http://localhost:4000/developers/>. The API docs are located at <http://localhost:4000/developers/api/>.

### Running the Jekyll Dev Server

To run only the Jekyll server at <http://localhost:4001/developers/>, first follow steps 1-5 above, then

**To Run Public Marketplace Version:**

`npm run devcenter:public`

**To Run Enterprise Version:**

`npm run devcenter:enterprise`

## Submodules

The [Algorithmia API Docs](https://github.com/algorithmiaio/api-docs) and [Synapse UX Toolkit](https://github.com/algorithmiaio/synapse) are included as submodules in this project. If you make updates to either of these repositories that you would like reflected in the Dev Center, `cd` into the submodule directory and check out the commit with your updates. Then `cd` back to the `dev-center` directory, run `git add [submodule directory]`, and commit.

If updates are made to the [api-docs](https://github.com/algorithmiaio/api-docs), **you will need to run `npm run apidocs:build` in order to see the changes**.

## Running End to End Tests

There are three different options you can use for running end to end tests: local, tunnel, and cloud:

    • Local: WebDriver runs tests using locally installed browsers against a local Node server.
    • Tunnel: WebDriver uses a BrowserStack integration to run the tests inside browsers within virtual machines. The requests are proxied to a local Node server.
    • Cloud: Same as tunnel, except the tests are run against our test environment instead of a local server.

To run end to end tests:

1. Reach out to the UX team to get BrowserStack credentials.
2. Ensure the following environment variables are set when calling the below scripts:
   - `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`
3. Run one of the following:
   - `npm run e2e:local`
   - `npm run e2e:tunnel`
   - `npm run e2e:cloud`

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

This Jekyll site uses several plugins to help generate content and make the site extra-awesome. Included in the `_plugins` directory:

- `Emoji.rb`: Emojify your posts. Simply use the text version (like you would on GitHub) and this plugin will replace it with the emoji image. See the [emoji cheat sheet](http://www.emoji-cheat-sheet.com) for a full listing of emoji codes. :nail_care:
- `jekyll-lunr-search.rb`: Generates the index of all posts for the search function.
- `strip.rb`: Removes some excess whitespace and new lines generated by the Liquid templating process.

## Environment Variables

#### `BASE_URL` | String

**Default**: "localhost:4000" in development, "algorithmia.com" in production.

**Description**: The base domain at which the app will serve its content.

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

#### `WEBAPI_BASE_URL` | String

**Default**: "https?://" + `BASE_URL`

**Description**: The internal URL that the server can use to talk to the Play server. Used to improve performance when makes calls internal to our VPC.

## Custom Components

We have a couple different custom components for formatting the Dev Center:

### Asides

**Note:** In order to use asides, the page content must be wrapped in the `.syn-article` class, which makes page content take up, by default, 7 of the 12 columns in the main content section. This allows space for asides in the right-hand 5 columns.

To add an aside, `include` the `aside-start`, `-middle`, and `-end` html partials in the page like so:

```markdown
{% include aside-start.html %}
<!-- Left-hand main content that the aside is associated with.
Aside will appear after this content on mobile and tablet screens -->
{% include aside-middle.html %}
<!-- Right-hand aside content -->
{% include aside-end.html %}
```

### Code Samples

Our code samples use Vue to allow multiple languages and click-to-copy functionality. For a basic code sample, include the following in your page:

```markdown
<code-sample>
  {% highlight bash %}<!-- Code to display -->{% endhighlight %}
</code-sample>
```

To include multiple language options for a sample, just add more than one `{% highlight [language] %}` section between the `code-sample` tags. By default, the component will use the language specified in the `highlight` liquid tag.

```markdown
<code-sample v-cloak>
  {% highlight python %}<!-- Python version of code -->{% endhighlight %}

  {% highlight java %}<!-- Java version of code -->{% endhighlight %}
</code-sample>
```

**Note:** For multi-language code samples. Be sure to add `v-cloak` to the `code-sample` opening tag. This will prevent a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) while Vue is initializing.

If you don't want to use the `highlight` language name for display, or you need to include multiple `highlight` blocks with the same language (client-side JS and Node, for example), you can wrap the `{% highlight %}` in a `div` with a `code-sample-language` attribute specifying the language to use.

```html
<code-sample v-cloak>
  <div code-sample-language="JavaScript">
    {% highlight javascript %}<!-- Client-side JS version of code -->{% endhighlight %}
  </div>
  <div code-sample-language="NodeJS">
    {% highlight javascript %}<!-- Node version of code -->{% endhighlight %}
  </div>
</code-sample>
```

## Contributing

First, fork the repository and follow the instructions above to get set up. Make sure all your changes work locally. When you are ready, make a pull request to this repo and we will review the changes. Be sure to describe the changes, attach screenshots of any cosmetic changes, and if applicable, link to the open issue.

## Need Help? Found a bug?

If you find a bug, can't follow the documentation, or have a question -- please [submit an issue!](https://github.com/algorithmiaio/dev-center/issues)

We will respond to you or reach out for more information as soon as possible. And, of course, feel free to submit pull requests with bug fixes or changes.
