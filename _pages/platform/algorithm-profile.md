---
categories: basics
excerpt: "A walk through of the algorithm profile page."
layout: article
nav_index: 20
tags: [basics]
image:
    teaser: /icons/algo.svg
permalink: /platform/algorithm-profile/
redirect_from:
  - /basics/algorithm-profiles/
  - /basics/algorithm_profiles/
show_related: true
title:  "Algorithm Profile"
---

This page describes the information that's available on each algorithm's profile page in Algorithmia's browser UI.

Below, we'll explain how to understand each portion of the algorithm profile by walking through the profile of [Nudity Detection i2v](https://algorithmia.com/algorithms/sfw/NudityDetectioni2v), a popular algorithm on our platform.

## Accessing an algorithm's profile page

To access an algorithm's profile page, click the name of the algorithm anywhere that it appears in the UI. You'll only be able to see the profile page for algorithms that are public, that you own, or that are owned by an organization of which you're a member.

## Profile page contents

### Algorithm Endpoint

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/header.png" alt="Algorithm Profile header" class="screenshot img-md">

At the top of every algorithm profile page, the algorithm endpoint is listed with a "copy" (clipboard) icon for convenience. The algorithm endpoint is globally unique within a cluster and consists of the algorithm owner, the algorithm name, and for published algorithms, the algorithm semantic version. Generically, we write this as `ALGO_OWNER/ALGO_NAME[/ALGO_VERSION]`. Therefore, for the nudity detection algorithm, the endpoint is `sfw/NudityDetectioni2v/0.2.13`.

For non-enterprise users: If the algorithm charges a royalty, you'll see the amount in credits next to the Algorithm Name.
{: .notice-warning }

### Overview

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

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/console.png" alt="Algorithm Profile console" class="screenshot img-md">

### Docs

The algorithm README documentation should help answer:

* What the algorithm does
* Expected input for that algorithm
* The expected output from that algorithm

Many algorithms also use this space to link to papers or other sites that more fully explain the technical implementation of the algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/description.png" alt="Algorithm Profile docs" class="screenshot">

### Errors

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/header.png" alt="Algorithm Profile header" class="screenshot img-md">


### Source

Open source licensed algorithms will show an additional tab in the algorithm profile header that says "Source Code" so you can see how that algorithm was implemented.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/viewsource.png" alt="Algorithm Profile View Source Code tab" class="screenshot">

### Profiles For Owned Algorithms

Profiles for algorithms owned by your account, or one of your organizations, will have additional features.

You will see two additional tabs: "Settings" and "Builds." Additionally, you will always see the "Source Code" tab.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/owned_algo_profile.png" alt="Owned Algorithm Profile" class="screenshot">

#### Algorithm Settings

The top of the Settings page includes information for working on an algorithm locally, as well as a tracker for the [algorithm checklist]({{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-checklist).

You can also edit your algorithm's settings, including source code visibility, license, hardware type, and the other permissions listed [here]({{site.baseurl}}/platform/permissions).

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_settings.png" alt="Algorithm Settings" class="screenshot">

At the bottom of the Settings page is the option to delete the algorithm, if it does not have a public version.

Use with care: deleted algorithms are gone forever.
{: .notice-warning }

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/delete_algo.png" alt="Algorithm Deletion" class="screenshot">

#### Algorithm Builds

The Builds page lists all builds of your algorithm, beginning with the most recent.

Builds are started when you push local commits to Algorithmia, or by using the "Build" option in the Algorithmia web IDE.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_builds_list.png" alt="Algorithm Builds" class="screenshot">

The following information is shown for each build:

* The commit SHA
* The build's start time
* The build's end time (or a spinner if still in progress)
* The build's duration, if complete
* The build's status
* The version published from the build, if there is one

If your latest build is successful and unpublished, you will see a "Publish" option in the version column. Clicking on this will start the publish flow for that build, with the same steps described [here]({{site.baseurl}}/algorithm-development/algorithm-basics/your-first-algo#publish-your-algorithm).

In the row for each build is a menu, with options to view the detail page for the build, download the build's logs, or publish the build if it is publishable.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_menu.png" alt="Algorithm Builds" class="screenshot">

The details page contains the same information and options as the builds list entry, with the addition of the callability of the build's version, if it has one, and the compilation logs for the build.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_detail.png" alt="Algorithm Builds" class="screenshot">



#### Wrapping Up

You should now have a good idea of how to understand the algorithm profile page.

Be sure to [make your first API call]({{site.baseurl}}/getting-started) or learn more about [algorithm pricing]({{site.baseurl}}/pricing), [permissions]({{site.baseurl}}/basics/permissions), and [versioning]({{site.baseurl}}/basics/versioning).
