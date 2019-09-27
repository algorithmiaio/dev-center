---
layout: article
title:  "Algorithm Profiles"
excerpt: "A walk through of the algorithm profile page."
categories: basics
nav_index: 20
tags: [basics]
show_related: true
image:
    teaser: /icons/algo.svg
permalink: /platform/algorithm-profiles/
redirect_from:
  - /basics/algorithm-profiles/
  - /basics/algorithm_profiles/
---

Each algorithm is showcased through its profile page.

Below, we'll explain how to understand each portion of the algorithm profile by walking through the profile of one of the most popular algorithms: [Nudity Detection i2v](https://algorithmia.com/algorithms/sfw/NudityDetectioni2v).

### Overview

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/header.png" alt="Algorithm Profile header" class="screenshot img-md">

#### Algorithm Name, Version, and Royalties

Every algorithm page has a Username, Algorithm Name, and Semantic Version:

```sfw/NudityDetectioni2v/0.2.13```

If the algorithm charges a royalty, you'll see the amount in credits next to the Algorithm Name.

"NudityDetectioni2v", you can see, charges a 2 credit royalty.

#### Algorithm Description

The algorithm description under the algorithm name should be concise telling users exactly what the algorithm does:

"Detect Nudity In Pictures."

This description also appears under the title of the algorithm in search results for quick reference.

#### Social Metrics

Each Overview page displays the number of stars and followers an algorithm has.

Following an algorithm will subscribe you to comments and help you keep up to date with activity on that particular algorithm.

Starring an algorithm is a social indicator saying you like the developer's algorithm.

#### Tags
Algorithm developers provide tags as the primary means for categorizing their algorithms and also allow you to navigate to similar algorithms by clicking on any tag.

#### Algorithm Metrics
Includes number of API calls, and average duration of API calls.

#### Permissions

Includes information about licensing, internet accessibility, GPU environments, and more.

For a deeper dive see: [permissions]({{site.baseurl}}/basics/permissions).

#### Run An Example

The console appears below the header and allows you to quickly experiment with the algorithm.

Click the "Run Example" button to have the algorithm run on the sample input in the left hand box, and the results will show in the output box on the right.

You can also experiment with your own data as long as it's in a format the algorithm accepts.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/console.png" alt="Algorithm Profile console" class="screenshot img-md">

### Docs

The algorithm README documentation should help answer:

* What the algorithm does
* Expected input for that algorithm
* The expected output from that algorithm

Many algorithms also use this space to link to papers or other sites that more fully explain the technical implementation of the algorithm.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/description.png" alt="Algorithm Profile docs" class="screenshot">

### Source Availability

Open source licensed algorithms will show an additional tab in the algorithm profile header that says "Source Code" so you can see how that algorithm was implemented.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/viewsource.png" alt="Algorithm Profile View Source Code tab" class="screenshot">

### Profiles For Owned Algorithms

Profiles for algorithms owned by your account, or one of your organizations, will have additional features.

You will see two additional tabs: "Settings" and "Builds." Additionally, you will always see the "Source Code" tab.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/owned_algo_profile.png" alt="Owned Algorithm Profile" class="screenshot">

#### Algorithm Settings

The top of the Settings page includes information for working on an algorithm locally, as well as a tracker for the [algorithm checklist]({{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-checklist).

You can also edit your algorithm's settings, including source code visibility, license, hardware type, and the other permissions listed [here]({{site.baseurl}}/platform/permissions).

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/algo_settings.png" alt="Algorithm Settings" class="screenshot">

At the bottom of the Settings page is the option to delete the algorithm, if it does not have a public version.

Use with care: deleted algorithms are gone forever.
{: .notice-warning }

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/delete_algo.png" alt="Algorithm Deletion" class="screenshot">

#### Algorithm Builds

The Builds page lists all builds of your algorithm, beginning with the most recent.

Builds are started when you push local commits to Algorithmia, or by using the "Build" option in the Algorithmia web IDE.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/algo_builds_list.png" alt="Algorithm Builds" class="screenshot">

The following information is shown for each build:

* The commit SHA
* The build's start time
* The build's end time (or a spinner if still in progress)
* The build's duration, if complete
* The build's status
* The version published from the build, if there is one

If your latest build is successful and unpublished, you will see a "Publish" option in the version column. Clicking on this will start the publish flow for that build, with the same steps described [here]({{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo#publish-your-algorithm).

In the row for each build is a menu, with options to view the detail page for the build, download the build's logs, or publish the build if it is publishable.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_menu.png" alt="Algorithm Builds" class="screenshot">

The details page contains the same information and options as the builds list entry, with the addition of the callability of the build's version, if it has one, and the compilation logs for the build.

<img src="{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_detail.png" alt="Algorithm Builds" class="screenshot">

#### Wrapping Up

You should now have a good idea of how to understand the algorithm profile page.

Be sure to [make your first API call]({{site.baseurl}}/getting-started) or learn more about [algorithm pricing]({{site.baseurl}}/pricing), [permissions]({{site.baseurl}}/basics/permissions), and [versioning]({{site.baseurl}}/basics/versioning).
