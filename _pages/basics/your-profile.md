---
layout: article
title:  "Your User Profile"
excerpt: "Information about your user profile."
categories: basics
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
author: steph_kim
image:
  teaser: /icons/algo.svg
---

This guide will usher you through your user profile and cover how to find your API key, check your account credits and look at your recent API calls.

{% include toc.html %}

## Your Profile

To access your profile, simple click on the user drop down next to the notifications icon in the top right of the navigation bar:

![Accessing the user drop down]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/user_drop_down.png)

Once inside the profile section, you'll find a horizontal menu of profile sections such as Credentials, Earnings, Account, and Payment Info. We'll go over each section to understand your profile below, but first let's start with the main profile page:

![profile main]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/profile.png)

The main area of your profile also includes some basis stats like the number of API calls you have made and the number of times your algorithms have been called. Additionally, you can find quick links to the algorithms you've published.

## Credentials

The credentials section of your profile is where you can find and manage your API keys. Below, you'll see that your profile comes with a pre-populated API key that was created when you signed up. This key, will be labeled "default-key", and will show up in the algorithm console when trying out algorithms in the browser.

![Credentials]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/credentials.png)

Click the pencil icon to edit the permissions and update the key. You can also create and delete new API keys if you are looking for more modular API key permissions. Follow this [Customizing API Keys & Access guide]({{ site.baseurl }}/basics/customizing-api-keys/) to learn more.

## Account

The account section of your profile is where you'll find the information about your account usage and your credits.

![Credits main]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/credits_main.png)

The graph on the left shows your account balance history over the last 30 day period. On the right, you'll more details about your account, such as the number of free credits remaining in this 30 day cycle as well as the total number of credits available, including your purchased credits. You can also purchase more credits through this page by clicking on the purple button.

If you have earned credits by publishing your own algorithms, you'll see the amount you've earned in USD as well.

Below the account overview, you'll see menu options to view your Usage, Earnings, and Transactions.

### Usage
![Usage]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/usage.png)

The usage section displays the date, the algorithms you've called, and the stats on your usage.

The number of calls is the full number of the times that you've called the algorithm, but you'll see that sometimes the Billed Calls column displays a lower value. This is because we don't bill API calls that result in an error.
{: .notice-info}

The next column is the Billed Time in seconds, which is the time it took for the algorithm to run on the platform. We use this compute time and the royalty on the algorithm to calculate the Cost in Credits, which you'll find in the right column.

For more information about pricing check out [Pricing]({{ site.baseurl }}/pricing/).

### Earnings

The next section, Earnings, is where you will find the records of the calls made to your algorithms:

![earnings]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/earning.png)

In this section, you'll see the algorithm listed by date as well as the version number for the algorithm. This is important if you are updating your algorithms and notice that people are still calling old versions. Knowing which versions of your algorithms that people are using will help you understand what backwards-compatibility you need as well as which versions are improvements for the algorithm callers.

In the case of earnings, you will only see the number of billable calls and their duration. You won't see the number of calls that resulted in an error and were not billed to the user who called the algorithm. The final column on the right is the total credits earned for that entry.

### Transactions

Find the history of your credits in the transactions section.

![Transactions]({{ site.cdnurl }}{{ site.baseurl }}/images/post_images/your_profile/transactions.png)

Here you'll see any purchases you've made for more credits as well as any credits that have been granted to your account.

## Edit Profile & Payment Info

In the edit profile section, you can update your name, email address, password, and notification settings.

You can save billing information in your account under "Payment Info". This is especially helpful if you've set up your account to auto-reload when you run low on credits.

## Avatar

When you sign up for Algorithmia, your profile will be auto-populated with the avatar linked to your [Gravatar](https://gravatar.com) account through your email address. If you don't have a Gravatar account, head on over to sign up and set a profile photo to be used on Algorithmia and many other services around the web.
