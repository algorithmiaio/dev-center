---
layout: article
title: "Style Guide"
categories: example
modified: 2016-01-05 16:36
author: liz_rush
---

Below is just about everything you'll need to style your posts. Check the source code to see the many embedded elements within paragraphs.

{% include toc.html %}

## Heading 2: Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

### Heading 3: Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

#### Heading 4: Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

##### Heading 5: Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

###### Heading 6: Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

### Body text

Lorem ipsum dolor sit amet, test link adipiscing elit. **This is strong**. Nullam dignissim convallis est. Quisque aliquam.

*This is emphasized*. 

Water is H<sub>2</sub>O. 

The New York Times <cite>(That’s a citation)</cite>.  Use citations for accessibility. 

<u>Underline</u>. 

### Blockquotes

> Lorem ipsum dolor sit amet, test link adipiscing elit. Nullam dignissim convallis est. Quisque aliquam.

> <cite>First Lastname, *The Greatest Article*</cite>

## List Types

### Ordered Lists

1. Item one
	 1. sub item one
	 2. sub item two
	 3. sub item three
2. Item two

### Unordered Lists

* Item one
* Item two
* Item three

## Tables

| Header1 | Header2 | Header3 |
|:--------|:-------:|--------:|
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |
|----
| cell1   | cell2   | cell3   |
| cell4   | cell5   | cell6   |

## Code Snippets

See the syntax_highlighting post in `_drafts`.

## Buttons

Make any link standout more when applying the `.btn` class.

{% highlight html %}
<a href="#" class="btn">Default Button</a>
{% endhighlight %}

<a href="#" class="btn">.btn</a>
<a href="#" class="btn-inverse">.btn-inverse</a>
<a href="#" class="btn-info">.btn-info</a>
<a href="#" class="btn-warning">.btn-warning</a>
<a href="#" class="btn-danger">.btn-danger</a>
<a href="#" class="btn-success">.btn-success</a>

### Social Media Buttons

<a href="#" class="btn-social facebook"><i class="fa fa-facebook" aria-hidden="true"></i> Facebook</a>

<a href="#" class="btn-social flickr"><i class="fa fa-flickr" aria-hidden="true"></i> Flickr</a>

<a href="#" class="btn-social foursquare"><i class="fa fa-foursquare" aria-hidden="true"></i> Foursquare</a>

<a href="#" class="btn-social google-plus"><i class="fa fa-google-plus" aria-hidden="true"></i> Google+</a>

<a href="#" class="btn-social instagram"><i class="fa fa-instagram" aria-hidden="true"></i> Instagram</a>

<a href="#" class="btn-social linkedin"><i class="fa fa-linkedin" aria-hidden="true"></i> LinkedIn</a>

<a href="#" class="btn-social pinterest"><i class="fa fa-pinterest" aria-hidden="true"></i> Pinterest</a>

<a href="#" class="btn-social rss"><i class="fa fa-rss" aria-hidden="true"></i> RSS</a>

<a href="#" class="btn-social tumblr"><i class="fa fa-tumblr" aria-hidden="true"></i> Tumblr</a>

<a href="#" class="btn-social twitter"><i class="fa fa-twitter" aria-hidden="true"></i> Twitter</a>

<a href="#" class="btn-social vimeo"><i class="fa fa-vimeo-square" aria-hidden="true"></i> Vimeo</a>

<a href="#" class="btn-social youtube"><i class="fa fa-youtube" aria-hidden="true"></i> YouTube</a>

## Badges

<div class="badges">
	<span class="badge">1</span>
	<span class="badge inverse">2</span>
	<span class="badge info">3</span>
	<span class="badge warning">4</span>
	<span class="badge danger">5</span>
	<span class="badge success">6</span>
</div>

## Notices

Set a block of text off from the rest.

**Default Notice:** `.notice` Maecenas ornare tortor. [Link](www.google.com) eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice}

Headline Notice:

<div class="notice">
	<h3>Headline</h3>
	<div class="inline-btn">
		<a href="#" class="btn-social instagram"><i class="fa fa-instagram" aria-hidden="true"></i> Instagram</a>
		<a href="#" class="btn-social linkedin"><i class="fa fa-linkedin" aria-hidden="true"></i> LinkedIn</a>
	</div><!-- /.inline-btn -->
</div><!-- /.notice -->

**Inverse Notice:** `.notice-inverse` Maecenas ornare tortor. Donec sed tellus [eget sapien fringilla]() nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice-inverse}

**Info Notice:** `.notice-info` [Maecenas ornare tortor](). Donec sed tellus eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice-info}

**Warning Notice:** `.notice-warning` Maecenas ornare tortor. Donec sed [tellus eget]() sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice-warning}

**Danger Notice:** `.notice-danger` Maecenas ornare tortor.[ Donec sed tellus]() eget sapien fringilla nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice-danger}

**Success Notice:** `.notice-success` Maecenas ornare tortor. Donec sed tellus eget [sapien fringilla]() nonummy. Mauris a ante. Suspendisse quam sem, consequat at.
{: .notice-success}


## Emojis

Emojis are rendered through a Liquid template filter. Use the github/slack format within your markdown, like so: :scream: :older_woman: :green_book: