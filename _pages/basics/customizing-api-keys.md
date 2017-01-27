---
layout: article
title:  "Customizing API Keys & Access"
excerpt: "Did you know you can have multiple API keys with different access permissions?"
categories: basics
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
author: liz_rush
image:
  teaser: /icons/algo.svg
---

To call algorithms and interact with the Data API, you'll use an API key to authenticate. But did you know you can create additional API keys and customize their access permissions? This guide will show you how.

{% include toc.html %}

## Your default API key

To view your API keys, head on over to your profile on Algorithmia and click on the "Credentials" option in the horizontal menu. For more information about your profile, be sure to check out the [Your Profile guide](https://developers.algorithmia.com/basics/your-profile) for more information.

![API keys home]({{ site.baseurl }}/images/post_images/api_keys/api_keys_home.png)

When you sign up for Algorithmia, your account is created with a default API key. Conveniently, it is named `default-key`! This key will show up in the code snippets on an algorithm profile page when you are signed in, allowing you to easily make calls to the algorithm either through the web console or by copying the code directly to include in your program. 

If you delete your `default-key`, it will no longer show up in the code snippets on the algorithm profile pages. Simply create a new key and name it `default-key` to have it appear again!
{: .notice-info }

## Adding a new API key

Let's walk through the process of adding an additional API key to your account. Click the purple "New simple key" button below the list of active keys. You'll be prompted with a dialog that allows you to name your new key and set the permissions on it:

![API keys dialog]({{ site.baseurl }}/images/post_images/api_keys/api_key_dialog.png)

## Access options

Each API key can be customized to enable or restrict access depending on your needs. This is particularly helpful if you are running multiple applications or websites that use the Algorithmia API. Each app can use a different key so that if they are ever compromised (such as accidentally pushing a key to GitHub), you won't have to reset the API key for each project. 

This allows you to put security first by only enabling the access you actually need. :closed_lock_with_key:

### Named algorithms only

One way you can restrict access with an API key is to only white list the algorithms that you want that key to be able to call. 

You can do this by adding the shorthand name for the algorithms you want the API key to access like so:

![caller origin]({{ site.baseurl }}/images/post_images/api_keys/algo_restrictions.png)

Note that we are using the alias version of the algorithm: `algo://` is the prefix you'll need to use before the owner name and algorithm name. Let's say that I have a project that has its own API key that I want to restrict to only call the algorithms I specify. I'll name my key after the project, then add the algorithms it can call. If I want to use [Generate Paragraph From Trigram](https://algorithmia.com/algorithms/lizmrush/GenerateParagraphFromTrigram), I'll format the alias like this: `algo://` + the algorithm owner + the algorithm name. Thus Generate Paragraph from Trigram would end ups as `algo://lizmrush/GenerateParagraphFromTrigram`. 

![caller origin]({{ site.baseurl }}/images/post_images/api_keys/algo_restrictions_no_star.png)

By default, any key can call any algorithm on the platform. You can see in the above screenshot that under the Algorithm Access section, there is an entry `algo://*`, which is highlighted. This is a wildcard that matches all of the algorithms. To make sure your key is restricted to calling only the algorithms you've specified above, be sure to remove this wildcard entry by clicking on the trashcan icon.

### Caller origin & hostname

Another way to customize your API keys and the permissions is to restrict the permissions on where API calls can originate. There are two options you can check in the dialog, native clients and web browser:

![caller origin]({{ site.baseurl }}/images/post_images/api_keys/call_origin.png)

If you are only calling Algorithmia through a client, you can leave that box checked and your key will work as you make API calls. However, if you plan to use this key on a website where you will be making CORS requests, select the web browser permission. When you check that box, another field will appear allowing for more customization:

![caller origin on web]({{ site.baseurl }}/images/post_images/api_keys/call_origin_web.png)

As you can see, when you allow cross-origin requests to use your authentication, you can restrict the access by referrer hostname. This is a security measure that allows you to say that the API key can only be used when the request is coming from your website.

### Data API Access

The third method to customize your API key access is to change its permissions relating to the Data API. By default, when you create a new API key data access is set to none.

![data default]({{ site.baseurl }}/images/post_images/api_keys/data_none.png)

You have two options to change the Data API access: you can either let your API key have permission to read only or to allow read and write access.

![data all]({{ site.baseurl }}/images/post_images/api_keys/data_all.png)

By selecting read only, you've set up your API key permissions to let it access data in through the API but not write to your data. This is good if you have an application that needs to be able to read a trained model or data file that you've stored in order to run the algorithm but won't be saving any data from the API call.

When you select read and write, the API key has the ability to both read from your data as well as write to it. For many algorithms, the results can be written to your storage through the Data API and the API key making the call will need the permissions to write. If you are trying to run an algorithm that writes to your data storage but are getting an authentication error, make sure that the API key you are using to authenticate has all the necessary permissions you need.

