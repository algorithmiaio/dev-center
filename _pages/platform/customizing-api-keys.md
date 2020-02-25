---
layout: article
title:  "API Keys"
excerpt: "Configuring API Keys"
categories: basics
nav_index: 50
tags: [basics]
show_related: true
image:
  teaser: /icons/algo.svg
permalink: /platform/customizing-api-keys/
redirect_from:
  - /basics/customizing-api-keys/
---

To call algorithms and interact with the Data API, you'll use an API key for authenticatication. 

This guide will show how to create new API keys and customize API access to suit your security needs.

{% include toc.html %}

## Default API key

To view your API keys, go to "Manage API Keys" under your account profile:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/my_api_keys_from_profile.png" alt="My API Keys from Profile Menu" class="screenshot">

When you sign up for an Algorithmia account, a default API key is automatically created called: `default-key`. 

This key will show up in the code snippets on an algorithm profile page when you are signed in, allowing you to easily make calls to the algorithm either through the web console or by copying the code directly to include in your program.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/default-key.png" alt="API keys home" class="screenshot">

If you delete your `default-key`, it will no longer show up in the code snippets on the algorithm profile pages. Simply create a new key and name it `default-key` to have it appear again.
{: .notice-info }

## Adding a new API key

Click the "Create New" button to the right of your username. Choose "API Key" where you'll see the following dialog box where you can name and configure your new API key:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/new-api-key.png" alt="API keys dialog" class="screenshot img-sm">

## Access options

Each API key can be customized to enable or restrict access depending on your needs. 

**Best Practice:** each application should have a its own API key with customized settings for that application's specific use case.

### Whitelist Algorithms

For security reasons, API keys can't call any algorithms on the platform by default. In order to create a key that can call algorithms, you'll have to explicitly add permissions by specifying the allowed owner name and algorithm name. Note that `algo://` is the prefix you'll need to use before the owner name and algorithm name. Below are a few examples:

| ACL        | Key can call: |
| :------------- | :------------- |
|  `algo://*` | all algorithms user can access. |
|  `algo://foo/*` | all algorithms by user `foo` user can access. |
|  `algo://foo/bar/*`&nbsp;&nbsp; | only the `bar` algorithm by user `foo`. |

<br>

In the below screenshot, only the `sentiment_analysis` algorithm by user `demos` can be invoked by this key:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/algo_restrictions_no_star.png" alt="caller origin" class="screenshot img-sm">

In cases where an entry is a subset of another entry, and therefore redundant, a warning will appear letting you know that it will have no effect. Here you can see that `algo://demos/sentiment_analysis` has no effect due to the addition of `algo://*`, which already permits access to all `demos` algorithms.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/algo_restrictions.png" alt="caller origin" class="screenshot img-sm">

### Caller origin & hostname

Another way to customize your API key access is to restrict the permissions on where API calls can originate. 

There are two options you can check in the dialog, native clients and web browser:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/call_origin.png" alt="caller origin" class="screenshot img-sm">

If you are only calling Algorithmia through a client, you can leave that box checked and your key will work as you make API calls. 

However, if you plan to use this key on a website where you will be making CORS requests, select the web browser permission. 

When you check that box, another field will appear allowing for more customization:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/call_origin_web.png" alt="caller origin web host" class="screenshot img-sm">

As you can see, when you allow cross-origin requests to use your authentication, you can restrict the access by referrer hostname. This is a security measure that allows you to say that the API key can only be used when the request is coming from your website.

### Data API Access

The third method to customize your API key access is to change its permissions relating to the Data API. By default, when you create a new API key, data access is set to "No Access".

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/data_none.png" alt="data default" class="screenshot img-sm">

You have two options to change the Data API access. You can either let your API key have permission to read only or to allow read and write access:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/api_keys/data_all.png" alt="data all" class="screenshot img-sm">

By selecting "Read Only", you've set your API key permissions to access data via the API, with no write access to your data. This is good if you have an application that needs to be able to read a trained model or data file that you've stored in order to run the algorithm, but won't be saving any data from the API call.

When you select "Read & Write", the API key will allow both read and write access to your data. For many algorithms, the results can be written to your data storage through the Data API and the API key, so both will need write permissions.

If you are trying to run an algorithm that writes to your data storage but are getting an authentication error, make sure that the API key you are using to authenticate has all the necessary permissions you need.
{: .notice-info }

### Algorithm Management

You can also control whether or not an API key can manage algorithms you own on your behalf. This allows the API key to perform operations such as creating, compiling, and publishing algorithms without the need to use the Web IDE. For more information, see [Algorithm Management]({{site.baseurl}}/algorithm-development/algorithm-management).
