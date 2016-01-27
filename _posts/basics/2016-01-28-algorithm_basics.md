---
layout: article
title:  "Algorithm Basics"
date:   2016-01-25 01:19:38
categories: basics 
author: liz_rush
excerpt: "All about pricing, permissions, and versioning on the platform."
image:
    teaser: /icons/fa-bolt.png
---


## Pricing
For an overview of algorithm pricing, see the [pricing page](https://algorithmia.com/pricing).

Algorithm usage is calculated in Algorithmia Credits. The current exchange rate for purchasing new credits is 10,000 credits to $1 USD.

#### Cost of running an algorithm

All algorithms in the marketplace are charged a fee of 1 credit per second (1cr/sec) of execution time on a single dedicated code. The execution time is calculated from the start of the algorithm execution until the algorithm returns.

In addition to the execution charge, algorithm developers may charge a royalty on each algorithm call. This cost-per-call royalty is associated with a specific version of the algorithm and will remain fixed indefinitely.

When an algorithm developer releases a new minor or major version of the algorithm, they have the option to include a pricing change. Make sure to include the version in your algorithm call to ensure a consistent experience.
{: .notice-info}

#### Algorithms that call other algorithms

Some algorithms build upon other algorithms to create a new service or tool. While this is a powerful way of leveraging the value of multiple algorithms and parallelizing work across the Algorithmia Cluster, such algorithms may incur additional usage costs.

When calling into an algorithm that uses another algorithm internally, you may encounter an additional usage cost at the same 1cr/sec of execution time per core. Additionally, you may incur additional royalty costs if the associated algorithm also charges a royalty.

View your last 30-days of account usage on your account page.
{: .notice-info}

## Permissions

Permissions can be found on the algorithm description page. The algorithm's author can indicate if the algorithm will require Internet access, call other algorithms, or if the users can view the source code. Some of these permissions will affect the amount of credits needed to run the algorithm. Be sure to check out the algorithm's permissions section on the description page for more information.

#### Internet Access

Many of the algorithms in the marketplace can be run without accessing the Internet. Some algorithms require retrieving or sending data outside of the Algorithmia platform during execution. If an algorithm's permissions indicate that it requires Internet access, please be aware that there is the potential for your data to leave the Algorithmia platform.

#### Calls Other Algorithms

Some algorithms call other algorithms in order to combine algorithms and parallelize workloads. This permission is listed on the description page so that you can determine if the algorithm will incur additional usage and royalty costs.

#### Source Code Visibility

Algorithm authors have the option of choosing to open source their algorithm. Open source algorithms have a button on the description to "View Source" and anyone can see the internal code of the algorithm. If an algorithm is closed source, this means that only the author has the ability to view the code. Note that open source algorithms still accrue fees for usage and may have a royalty fee.

## Versioning

Each algorithm follows the same versioning scheme composed of a revision number, minor version number, and major version number. This allows algorithm developers the ability to update and improve their algorithms while maintaining a dependable version for consumers to call.

#### Revisions (-.-.z)

Revisions are for publishing backward-compatible bug fixes.

Revisions carry the same price and visibility to ensure that existing consumers of an algorithm continue to have access to an algorithm and its bug fixes at a predictable price.

#### Minor Versions (-.y.-)


Minor versions are for publishing new functionality in a backwards-compatible manner.

Algorithm developers may elect to change the royalty cost for a new minor version of an algorithm.

#### Major Versions (x.-.-)

Major version changes is an upcoming feature which will provide a mechanism for publishing breaking changes to an algorithm. Currently, algorithm authors are unable to make a major version change.

When an algorithm has a minor or major version change, the author has the opportunity to update the cost and permissions. Remember to version your API calls to avoid unexpected changes.
{: .notice-warning }
