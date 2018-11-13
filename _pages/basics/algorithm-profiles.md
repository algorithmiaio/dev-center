---
layout: article
title:  "Algorithm Profiles"
excerpt: "A walk through of the algorithm profile page."
categories: basics
tags: [basics]
show_related: true
image:
    teaser: /icons/algo.svg
---

Each algorithm is showcased on the marketplace through the profile page. Below, we'll explain how to understand each portion of the algorithm profile by walking through the profile of one of the most popular algorithms: [Nudity Detection](https://algorithmia.com/algorithms/sfw/NudityDetection)


#### The Profile Overview:

The profile overview provides a rich source of information about the algorithm. In the overview, you can find the name of the algorithm, the tagline, and quickly see the version, royalty and permissions. Additionally, you'll also see the number of stars and followers an algorithm as, as well as the number of times the algorithm has been called.

![Algorithm Profile header]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm_profiles/header.png)

The tagline lives underneath the title of the algorithm and is a succinct way to let you quickly understand what it does. This tagline also appears under the title of the algorithm in marketplace search results for quick reference. In the case of Nudity Detection, you can see that the author has provided the tagline "Detect nudity in pictures" so you know exactly what to expect!

You can also see that the number of stars, followers, and number of API calls the algorithm has in the statistics bar below below the purple section. You can star or follow the algorithm by clicking on one of those two icons! Following will subscribe you to comments and help you keep up to date with activity on that particular algorithm. Starring an algorithm is like giving the author a virtual high-five! :pray:

Below the main details, you can see the various tags that the author has included. These tags provide the primary means for categorizing algorithms and also allow you to navigate to similar algorithms by clicking on any tag.

Finally, the last section of the algorithm header is the Permissions section. Here you will see more details on the algorithm's permissions, such as if it needs access to the Internet or if it calls another algorithm. Learn more about permissions [here]({{ site.baseurl}}/basics/permissions/).

#### Description, Pricing, & Permissions:

The algorithm README documentation is easily available on the algorithm profile page by clicking the "Docs" tab. The Docs is where the algorithm developer writes an explanation of what the algorithm does, what kind of input you need to use, and what kind of output you can expect from the algorithm. Many algorithms also use this space to link to papers or other sites that more fully explain the technical implementation of the algorithm.

![Algorithm Profile docs]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm_profiles/description.png)

By using the next tab on the profile page, "Cost", you can see see the pricing and permissions information for the algorithm.

![Algorithm Profile pricing]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm_profiles/pricing.png)

The Cost tab, shown above, is an interactive section of the profile where you can estimate the cost of the algorithm. It uses the average duration of calls across the system and the number of API calls to calculate the estimated cost in credits.

The estimate is based off the average duration of API calls. Your call duration may vary slightly.
{: .notice-warning }

#### Algorithm Console & Sample Input:

Trying out each algorithm is incredibly easy and can be done using the console included on every algorithm profile.  The console appears below the header and allows you to quickly experiment with the algorithm. You will see two large black boxes side-by-side labeled "Type you input" and "See the result". If the algorithm developer has provided sample input, you will see it in left-hand box. Simply click the purple "Run" button to have the algorithm run on the sample input and you will see results in the output box on the right!

![Algorithm Profile console]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm_profiles/console.png)


#### Source Availability

If the algorithm developer has published under an Open Source license, you will see an additional tab in the algorithm profile header that says "Source" that takes you directly to the source code.

![Algorithm Profile View Source Code tab]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/algorithm_profiles/viewsource.png)


 Click this button to see the algorithm code!

#### Wrapping Up

You should now have a good idea of how to understand the algorithm profile page. Be sure to [make your first API call]({{ site.baseurl }}/getting-started/) or learn more about [algorithm pricing]({{ site.baseurl }}/pricing/), [permissions]({{ site.baseurl }}/basics/permissions/), and [versioning]({{ site.baseurl }}/basics/versioning/).
