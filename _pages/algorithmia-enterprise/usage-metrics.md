---
layout: article
title:  "Platform Usage Reporting"
excerpt: "The Admin Panel's Platform Usage Feature"
categories: [algorithmia-enterprise, basics]
show_related: false
image:
    teaser: /icons/algo.svg
---

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

## Platform Usage Metrics

Usage metrics of the platform can be viewed from the admin panel under `Platform Usage`. Given a customizable date range (which defaults to the past 7 days), users can view platform usage from three different perspectives: all usage, algorithms, and users. This is presented as a table in the UI, in which you can click on each row to get expanded information. The date range can be selected in preset intervals of the past seven, 14, or 30 days; or one of the past three months can be selected. You can also designate a more customized date range.


### All Usage

This tab shows information grouped by the username/algorithm tuple. That is, it shows which users called which algorithms and the number of times they did so (along with hardware, compute time, and other metrics).

When you click on a row in the all usage table, you will see the complete set of columns:
- algorithm: algorithm display name
- version: hash version of the exact algorithm called
- caller: which user called the algorithm
- owner: user who created and owns the algorithm
- total calls: total number of calls the calling user made to this algorithm in the date range
- total duration: total number of seconds the algorithm ran for caller in the date range
- total errors: total number of failed calls to this algorithm the caller made in the date range
- error duration: total number of seconds the algorithm ran for calls in which it returned an error (for this caller)
- hardware: whether the algorithm runs on a CPU or GPU instance

One caveat to the total compute time: each call is rounded **up** to the nearest second. For instance, if in the given date range, a user calls a certain algorithm twice, and the first call took 2.04 seconds and the second call took 2.08 seconds, the total time for those two calls is 4.12 seconds, which the table will round up and display as 5 seconds. 

Also note that if a call takes less than one second, the call’s duration will be rounded up to a full second. So calling Hello World 23 times would most likely result in a total duration of 23 seconds being displayed. The motivation for this is that in the algorithm marketplace we only charge by credits. One credit = one second, so if a user makes a call that lasts less than a second we still charge for the full second.


### Algorithms

This tab shows usage information grouped at the algorithm level. That is, it shows which algorithms were called and how many times (total across all users) they were called.

When you click on a row in the algorithms table, you will see this complete set of columns:
- algorithm: algorithm display name
- version: hash version of the exact algorithm called
- owner: user who created and owns the algorithm
- total calls: total number of calls that users of the platform made to this algorithm
- total duration: total number of seconds the algorithm ran summed up across all users
- total errors: total number of errors this algorithm returned summed up across all users
- error duration: total number of seconds the algorithm ran calls in which it returned an error (summed up across all users)
- hardware: whether the algorithm runs on a CPU or GPU instance


### Users

This tab shows usage information grouped at the user level, so you can see how many total calls each user made (across all algorithms).

When you click on a row in the users table, you will see this complete set of columns:
- caller: the username of the user this row represents
- total calls: total number of calls the user made summed up across all algorithms
- total duration: total number of seconds the user’s calls spent computing summed up across all algorithms
- total errors: total number of errors returned to the user summed up across all algorithms
- error duration: total number of seconds computed by calls that returned errors to the user


If users would like to perform more advanced operations on the tables (like sorting, customized grouping and summing) there is an option to download the full tables as CSV files.


If you're new to Algorithmia and would like to learn more about our product and its usage tracking capabilities, please [contact our sales team](https://info.algorithmia.com/contact-sales). We'd love to hear from you!