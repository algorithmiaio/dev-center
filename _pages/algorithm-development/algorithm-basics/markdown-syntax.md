---
layout: article
title:  "Markdown Syntax"
excerpt: "Markdown syntax for Algorithm descriptions."
categories: algorithm-basics
tags: [algo-dev-basics]
show_related: true
image:
  teaser: /icons/algo.svg
---

When you are ready to write the documentation for your algorithm under the "Docs" tab on your algorithm's page, you can use markdown to make your documentation clear.

Algorithmia's description editor is a CommonMark markdown editor with auto-link and GFM table support.

#### Basic formatting

<pre>
*italics*
_italics_
**bold**
__bold__
~~strikethrough~~
</pre>

#### Headers

<pre>
## Medium header
### Small header
#### Tiny header
</pre>

We recommend avoiding `H1` level headers (single `#`) as it may negatively impact discoverability (i.e. SEO) of your algorithm.
{: .notice-info}

#### Lists

<pre>
* Bullet list item
* Bullet list item
* Bullet list item

1. Numbered list item
2. Numbered list item
3. Numbered list item
</pre>

#### Links

<pre>
[Text to display](http://www.example.com)
</pre>

Bare URLs will also be automatically converted to links.
{: .notice-info}

#### Quotes

<pre>
> This is a quote.
> It can span multiple lines!
</pre>

#### Images

<pre>
![](http://www.example.com/image.jpg)
</pre>


#### Videos

You can add mp4 videos using the HTML `<video>` tag.

<pre>
&lt;video src="https://example.com/demo.mp4"&gt;&lt;/video&gt;
</pre>

#### Tables

<pre>
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| John     | Doe      | Male     |
| Mary     | Smith    | Female   |
</pre>

Aligning the column separators is optional. This table renders the same:

<pre>
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| John | Doe | Male |
| Mary | Smith | Female |
</pre>

You may also specify the rendered alignment of each column:

<pre>
| Left-aligned    | Center-aligned      | Right-aligned |
| :-----------    | :------------:      | ------------: |
| Example         | Expensive item      | $1600 |
| Another example | Less expensive item | $900 |
</pre>

#### Code

Inline code is specified with single tick marks:

<pre>`var example = "hello!";`</pre>

Multi-line code-fenced blocks will auto-detect language for code highlighting:

<pre>
```
var example = "hello!";
alert(example);
```
</pre>

You can also explicitly specify language for code-fenced blocks:

<pre>
```json
{
  "name": "jane"
}
```
</pre>

If you want to disable code-highlighting, use `text` as the explicitly specified language.
{: .notice-info}

