---
categories: basics
excerpt: "Information about your api calls and credits."
image:
  teaser: /icons/algo.svg
layout: article
nav_index: 10
show_related: true
tags: [alg-dev-getting-started, app-dev-getting-started]
title:  "Account"
redirect_from:
  - /basics/your-profile/
  - /platform/your-profile/
permalink: /platform/account-profile/
---

This guide will walk through the information that's available on your account profile page within Algorithmia's browser UI.

## Accessing your account profile page

To access your profile page from anywhere within Algorithmia's browser UI, click on the user icon in the bottom-left corner and click on your name at the top of the menu.

![Accessing your profile page]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/user_drop_down.png)

On the **Overview** tab, you'll find The main area of your profile also includes some basis stats like the number of API calls you have made and the number of times your algorithms have been called. Additionally, you can find quick links to the algorithms you've published.

## Profile page tabs

### Overview

On the overview page, you'll see any teams of which you're a member if you're using the Algorithmia Teams platform. You'll, also see a 

### My Algorithms

### Organizations

### API Keys

### Errors

### Account

### Settings



The account section of your profile is where you'll find the information about your account usage and your credits.

![Credits main]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/credits_main.png)

The card on the left shows details about your account, such as the number of free credits remaining in this 30 day cycle as well as the total number of credits available, including your purchased credits. You can also purchase more credits through this page by clicking Purchase Credits. The card to the right displays your payment information, if any, and allows you to update or remove your current payment method.

If you have earned credits by publishing your own algorithms, you'll see the amount you've earned in USD as well.

Below the account overview, you'll see a chart of your balance over time, then menu options to view your Usage, Earnings, and Transactions.

### Usage
![Usage]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/usage.png)

The usage section displays the date, the algorithms you've called, and the stats on your usage.

The number of calls is the full number of the times that you've called the algorithm, but you'll see that sometimes the Billed Calls column displays a lower value. This is because we don't bill API calls that result in an error.
{: .notice-info}

The next column is the Billed Time in seconds, which is the time it took for the algorithm to run on the platform. We use this compute time and the royalty on the algorithm to calculate the Cost in Credits, which you'll find in the right column.

For more information about pricing check out [Pricing]({{site.baseurl}}/pricing).

### Earnings

The next section, Earnings, is where you will find the records of the calls made to your algorithms:

![earnings]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/earning.png)

In this section, you'll see the algorithm listed by date as well as the version number for the algorithm. This is important if you are updating your algorithms and notice that people are still calling old versions. Knowing which versions of your algorithms that people are using will help you understand what backwards-compatibility you need as well as which versions are improvements for the algorithm callers.

In the case of earnings, you will only see the number of billable calls and their duration. You won't see the number of calls that resulted in an error and were not billed to the user who called the algorithm. The final column on the right is the total credits earned for that entry.

### Transactions

Find the history of your credits in the transactions section.

![Transactions]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/transactions.png)

Here you'll see any purchases you've made for more credits as well as any credits that have been granted to your account.

## Edit Profile & Payment Info

In the Settings section of your profile, you can update your name, email address, password, and notification settings. Payment information can be updated in the Account section.

## Avatar

When you sign up for Algorithmia, your profile will be auto-populated with the avatar linked to your [Gravatar](https://gravatar.com) account through your email address. If you don't have a Gravatar account, head on over to sign up and set a profile photo to be used on Algorithmia and many other services around the web.
