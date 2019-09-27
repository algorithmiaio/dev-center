---
layout: article
title:  "Algorithm Checklist"
excerpt: "Follow these tips to create the best algorithm profile possible."
categories: algorithm-development
tags: [algo-dev]
show_related: true
image:
  teaser: /icons/algo.svg
permalink: /algorithm-development/algorithm-checklist/
redirect_from:
  - /algorithm-development/algorithm-basics/algorithm-checklist/
  - /basics/algorithm_checklist/
  - /guides/algorithm_checklist/
---

To get the most out of your algorithm profile and boost its visibility, follow these tips to create the best algorithm profile possible.

## The Checklist

* Write a Full Description
  * What does the algorithm do?
  * Describe the inputs & expected outputs
  * Link to any papers or external documentation
* Give It a Tagline
* Add Tags
* Include Sample Input
* Update Pricing
* Check Permissions & Source Code Visibility


### Write a Full Description

On the profile page for your algorithm, the first thing an Algorithmia user will see if the description. It's important that this section be clear and helpful!

You'll want to make sure that someone who doesn't have any previous knowledge of the algorithm will be able to understand what it does and when you might want to use the algorithm.

#### What does the algorithm do?

Make sure to describe what the algorithm does. It is better to use clear and simple language in the description so that every user can understand it.

The algorithm description is front-and-center on the algorithm profile page. Use the description to write a clear explanation of what the algorithm does, what kind of input it takes, and what kind of output the user can expect. Be sure to highlight the various ways your algorithm can be used so that users get a thorough understanding of what types of problems the algorithm solves.

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/description.png" alt="Algorithm description" class="screenshot img-md">

#### Describe the inputs & expected output

Be sure to quickly describe the input needed to call the algorithm and the types it accepts. For example, you can say that the algorithm takes a string of text or an integer. If an algorithm has optional input parameters, be sure to include those and descriptions of what each option does.

It is also helpful to explain what the output of the algorithm should be. If your algorithm returns an output that corresponds to a value system, be sure to explain what it means. For example, in the algorithm for Sentiment Analysis, the user gets an output of a number between 0 and 4. The algorithm description describes what these numbers mean; in this case, the sentiment rating of very negative, negative, neutral, positive, and very positive.

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/io.png" alt="inputs and outputs" class="screenshot img-md">

#### Configure error handling

To make your algorithm easy to use, it's key to implement informative error handling. Check out the [Algorithmia Guide to Better Error Handling]({{site.baseurl}}/algorithm-development/algorithm-errors) for some guidance. Extensive functionality is only available in Python for now, but we're working on adding support for other languages.

#### Link to any papers or external documentation

If your algorithm is based off an academic paper or external library, you should also include a link to this documentation to give the users a chance to read more. Giving credit to the original source that your algorithm is based on is a best practice and allows curious users to take a deeper dive into the internal workings of the algorithm. Plus it's good karma!

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/credits.png" alt="inputs and outputs" class="screenshot img-md">

### Give It a Tagline:

The tagline is a succinct way to describe your algorithm. The tagline will appear under the title of the algorithm in marketplace search results, so it's important to add a tagline.

> Ex. Tagline for Sentiment Analysis:

Determine sentiment from text

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/search.png" alt="inputs and outputs" class="screenshot img-md">

### Add Tags:

Tags are an important part of your algorithm profile page. These tags help make sure that your algorithm is discoverable when the user is searching through categories of algorithms.

> Ex. Tags for Sentiment Analysis:

nlp
sentiment analysis
stanford corenlp
text analysis

### Include Sample Input:

Sample input is one of the most important parts of your algorithm profile. Users will look at your sample input and output to see if the algorithm can be applied to their data and what they can expect, so be sure to add sample input. It is editable at any time and the latest publicly callable version of the algorithm will be used to generate the sample output on the algorithm description page.

> Ex. Sample input for Sentiment Analysis:

"Algorithmia loves you!"

> Ex. Sample output for Sentiment Analysis:

`4`

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/sample_input.png" alt="inputs and outputs" class="screenshot img-md">

A common gotcha for setting and updating the sample input is that you must publish your algorithm before you can save the sample input. If you are unable to save your sample input, double check that the algorithm has been published before continuing.
{: .notice-warning }

### Update Pricing:

If you are publishing a new version of your algorithm, you can update the pricing of each call. This will be displayed next to your algorithm's name on the overview page. Remember, you can set the royalty price even if your code is open source!

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/cost.png" alt="inputs and outputs" class="screenshot img-md">

### Check Permissions & Source Code Visibility:

* Permissions: Any special permissions that this algorithm requires.
* Source Availability: The license and source visibility of an algorithm.

<img src="{{site.baseurl}}/images/post_images/algorithm_checklist/permissions.png" alt="inputs and outputs" class="screenshot img-md">
