---
categories: basics
excerpt: "A walk through of your account profile page."
image:
  teaser: /icons/algo.svg
layout: article
permalink: /platform/account-profile/
show_related: true
redirect_from:
  - /basics/your-profile/
  - /platform/your-profile/
tags: [alg-dev-getting-started, app-dev-getting-started]
title: "Accounts"
---

This page describes the information that's available on your account profile page within Algorithmia's browser UI.

## Accessing your account profile page

To access your profile page from anywhere within Algorithmia's browser UI, click on the user icon in the bottom-left corner and click the account display name at the top of the menu.

![Accessing an account profile page]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/user_drop_down.png)

You can also access other accounts' profile pages, but some of the details described here won't be visible if you aren't authenicated into the account you're viewing.
{: .notice-info}

## Profile page contents

### Overview

This tab displays a summary list of algorithms you own. If you're not on the Algorithmia Enterprise platform, this page also lists any teams of which you're a member, and displays information about your [credit usage](#account).

### My Algorithms

This tab displays a paginated list of the algorithms you own, with options available for each algorithm through the action menu at the right of the corresponding row in the table. To get started creating algorithms, see [Getting Started]({{site.baseurl}}//algorithm-development/your-first-algo).

### Organizations

This tab lists any organizations of which you're a member. To learn about how to use organizations, see [Organizations]({{site.baseurl}}//platform/organizations).

### API Keys
This tab displays the API keys you own. Each key can be edited or deleted through the action menu at the right of the corresponding row in the table. For information about how to use API keys, see [API Keys]({{site.baseurl}}//platform/customizing-api-keys).

### Errors
Beginning in Algorithmia version 20.5.57, this tab displays execution errors from algorithms that you've called. Specifically, it lists the 200 most recent algorithm execution errors over the past seven days that've been called using any of your API keys. Note that this feature is disabled by default and can only be [enabled by a cluster administrator](https://training.algorithmia.com/managing-advanced-workflows/829681).

For each error, the algorithm endpoint is listed along with the exact date and time that the error occurred. If the error is a [custom Algorithmia error type]({{site.baseurl}}/algorithm-development/algorithm-errors), that information is displayed as well. The error message is displayed in red below these details.

To expose additional details about the error and associated execution metadata, click the drop-down arrow to the right. The request ID, the worker node that handled the request, the first 128 characters of the input to the algorithm, and the expanded stack trace information are displayed.

![Viewing algorithm execution errors]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/account-profile-errors.png)

### Account

This tab is only visible if you're **not** using the Algorithmia Enterprise platform.
{: .notice-info}

This tab displays information about your account usage and your credits.

![Credits main view]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/credits_main.png)

The card on the left shows details about your account, such as the number of free credits remaining in the current 30-day cycle as well as the total number of credits available, including your purchased credits. You can also purchase more credits through this page by clicking the **Purchase Credits** button. The card to the right displays your payment information, if any, and allows you to update or remove your current payment method.

If you've earned credits by publishing your own algorithms, you'll see the amount you've earned (in USD) as well.

Below the account overview, you'll see a chart of your balance over time, then menu options to view your algorithm usage, your earnings, and your credit transactions.

#### Usage

This section displays the algorithms you've called, the date of each call, and associated usage statistics.

The **number of calls** column lists the number of times that you've called each algorithm, but you'll see that sometimes the **billed calls** column displays a lower value. This is because we don't bill API calls that result in an error.
{: .notice-info}

The **billed time** column lists the time billed, in seconds, which is the time it took for the algorithm to execute on the platform. We use this compute time and the royalty on the algorithm to calculate the value in the **cost in credits** column.
![Algorithm usage]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/usage.png)

For more information about pricing, see [Pricing]({{site.baseurl}}/pricing).

#### Earnings

In this section, you'll find the records of the calls made to your algorithms.

![Account earnings]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/earning.png)

Here, you'll see the algorithm listed by date, as well as its version number. This is important if you're updating your algorithms and notice that people are still calling old versions. Knowing which versions of your algorithms people are using can help you understand what backward compatibility you need as well as which versions are improvements for the algorithm callers.

In the case of earnings, you'll only see the number of billable calls and their duration. You won't see the number of calls that resulted in an error and were not billed to the user who called the algorithm. The final column on the right is the total credits earned for that entry.

#### Transactions

In this section you'll find the history of your credit refills, including any purchases you've made for more credits and any credits that have been granted to your account

![Account credit transactions]({{site.cdnurl}}{{site.baseurl}}/images/post_images/your_profile/transactions.png)

### Settings

In this section, you can update your name, email address, password, and notification settings. You can also upload a photo for your profile page and manage authorizations for external source code management systems.

#### Avatar

When you sign up for Algorithmia, your profile will be auto-populated with the avatar linked to your [Gravatar](https://gravatar.com) account through your email address. If you don't have a Gravatar account, we recommend you head over to sign up and set a profile photo to be used on Algorithmia and many other services around the web.
