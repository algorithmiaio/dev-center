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

To access an algorithm's profile page, click the name of the algorithm from any part of the application. You'll only be able to see the profile page for algorithms that are public, that you own, or that are owned by an organization of which you're a member.

## Profile page contents

### Algorithm Endpoint

At the top of every algorithm profile page, the algorithm endpoint is listed with a "copy" (clipboard) icon next to it for convenience. The algorithm endpoint is globally unique within a cluster and consists of the algorithm owner, the algorithm name, and for published algorithms, the algorithm semantic version. Generically, this can be expressed as `ALGO_OWNER/ALGO_NAME[/ALGO_VERSION]`. For the nudity detection algorithm, the endpoint is `sfw/NudityDetectioni2v/0.2.13`.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/header.png" alt="Algorithm Profile header" class="screenshot img-md">

For non-enterprise users: If an algorithm charges a royalty, you'll see the amount in credits next to the algorithm name.
{: .notice-warning }

### Stars and follows

At the top-right corner of every algorithm profile page it displays the number of stars and followers an algorithm has.

Following an algorithm will subscribe you to comments and help you keep up to date with activity on that particular algorithm.

Starring an algorithm indicates to the developer, as well as other users, that the algorithm is useful to you, and adds it to your starred algorithm list, which can be found in the ML service catalog on the left nav bar.

### Overview

#### Description text

The algorithm description under the algorithm name is a concise setence telling users exactly what the algorithm does, e.g., "Detect Nudity In Pictures."

This description also appears under the title of the algorithm in search results for quick reference.

#### Tags

Algorithm developers provide tags as the primary means for categorizing their algorithms. Tags also allow you to navigate to similar algorithms by clicking on any tag to see a list of algorithms with that tag.

#### Metrics

This section includes the number and average duration of API calls, and the number of published versions. Click on the number of versions to see the release notes for each version.

#### Permissions

This section includes information about licensing, internet accessibility, and visibility to others on the cluster. For a deeper dive, see [Permissions]({{site.baseurl}}/platform/permissions).

#### Run an example

In this section there's a test console where you can experiment with the algorithm. Click the **Run Example** button to have the algorithm run on the sample input supplied in the left hand box, and the results will show in the output box on the right.

You can experiment with your own input data as long as it's in a format the algorithm accepts. To know what the format is, visit the algorithm's [Docs](#docs) tab, where that type of information is documented.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/console.png" alt="Algorithm Profile console" class="screenshot img-md">

#### Install and use

In this section you can toggle between 15 supported client languages to view code for installing the algo CLI, our command-line based tool, as well as the client code to call your algorithm from any of the supported client languages. To learn more about how this works, see our [Getting Started Guide]({{site.baseurl}}/algorithm-development/your-first-algo).

### Docs

This tab displays a rendering of the algorithm's README file, which is written in Markdown. If you have write access to the algorithm, you'll be able to edit the README through this interface. The documentation here should describe:

* What the algorithm does
* Example(s) of expected input for the algorithm
* Example(s) of expected output from the algorithm, given the example input(s)

Many algorithms also use this space to link to research papers or other sites that more fully explain the technical implementation of the algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/description.png" alt="Algorithm Profile docs" class="screenshot">

### Discussion

This tab serves as a thread for any comments, questions, and answers pertaining to the algorithm.

### Errors

Beginning in Algorithmia version 20.5.52, non-admin users can see runtime errors from algorithms that they own or that are owned by an organization of which they're a member. Note that this feature is disabled by default and can only be [enabled by a cluster admin](https://training.algorithmia.com/managing-advanced-workflows/829681).

This tab lists the 200 most recent algorithm runtime errors over the past seven days. For each error, the caller and algorithm endpoint are listed along with the exact date and time that the error occurred. If the error is a custom Algorithmia error type, that information is displayed as well. The error message is displayed in red below these details.

To expose additional details about the error and associated execution metadata, click the drop-down arrow to the right. The request ID, the worker node that handled the request, the first 128 characters of the input to the algorithm, and the expanded stack trace information are displayed.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algorithm-profile-errors.png" alt="Algorithm Profile Runtime Errors" class="screenshot img-md">

### Source Code

This tab will be visible if you're viewing an open-source licensed algorithm, an algorithm you own, or an algorithm owned by an organization of which you're a member. Clicking this tab navigates you to our Web IDE, where you can see how the algorithm was implemented.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/viewsource.png" alt="Algorithm Profile View Source Code tab" class="screenshot">

## Profiles for owned algorithms

In addition to the Source Code tab, profiles for algorithms owned by your account, or by organizations of which you're a member, will have three additional tabs, described below.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/owned_algo_profile.png" alt="Owned Algorithm Profile" class="screenshot">

### Builds

The Builds page lists all builds of your algorithm, beginning with the most recent.

Builds are started when you push local commits to Algorithmia, or by using the **Build** option in the Algorithmia web IDE.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_builds_list.png" alt="Algorithm Builds" class="screenshot">

The following information is shown for each build:

* The commit SHA
* The build's start time
* The build's end time (or a spinner if still in progress)
* The build's duration, if complete
* The build's status
* The version published from the build, if there is one

If your latest build is successful and unpublished, you'll see a **Publish** option in the **Version** column. Clicking on this will start the publish process for that build, with the same steps described [here]({{site.baseurl}}/algorithm-development/your-first-algo#publishing-your-algorithm).

At the right of the row for each build is an action menu that provides options to view the detail page for the build, download the build's logs, or publish the build if it is publishable.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_menu.png" alt="Algorithm Builds" class="screenshot">

The details page contains the same information and options as the builds list entry, with the addition of the callability of the build's version, if it has one, and the compilation logs for the build.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_build_detail.png" alt="Algorithm Builds" class="screenshot">

### Versions

This tab lists each published algorithm version (if any), its associated release notes, and whether it's public or private. To learn more about versioning, see [Versioning]({{site.baseurl}}/platform/versioning).

### Settings

The top of this tab includes information for working on an algorithm locally, as well as a tracker for the [algorithm checklist]({{site.baseurl}}/algorithm-development/algorithm-basics/algorithm-checklist).

Here you can also edit your algorithm's settings here, including source code visibility, license, algorithm environment, and other [permissions]({{site.baseurl}}/platform/permissions). Also displayed here is the algorithm's language, but note that this property cannot be changed once the algorithm is created.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/algo_settings.png" alt="Algorithm Settings" class="screenshot">

At the bottom of this tab is the option to delete the algorithm if it doesn't yet have a public published version.

Use the **Delete Algorithm** button with care; deleted algorithms are gone forever!
{: .notice-warning }

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/algorithm_profiles/delete_algo.png" alt="Algorithm Deletion" class="screenshot">
