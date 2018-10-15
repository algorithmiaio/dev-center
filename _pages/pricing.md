---
layout: article
title:  "Pricing"
excerpt: "All about pricing on the platform."
tags: [alg-dev-getting-started, app-dev-getting-started]
redirect_from:
 - /pricing-permissions/
show_related: true
image:
    teaser: /icons/algo.svg
---


**Enterprise Users:** the information on this page is intended for _public marketplace users only._
{: .notice-info}

### Pricing
For an overview of algorithm pricing, see the [pricing page](https://algorithmia.com/pricing).

Algorithm usage is calculated in Algorithmia Credits. The current exchange rate for purchasing new credits is 10,000 credits to $1 USD. This was chosen to translate into 1 credit = 1 second of compute time.

#### Cost of running an algorithm

All algorithms in the marketplace are charged a fee of 1 credit per second (1cr/sec) of execution time on a single dedicated node. The execution time is calculated from the start of the algorithm execution until the algorithm returns.

In addition to the execution charge, algorithm developers may charge a royalty on each algorithm call. This cost-per-call royalty is associated with a specific version of the algorithm and will remain fixed indefinitely. This ability to apply royalties to an algorithm is to reflect the fact that the value of an algorithm is more than just the seconds of computation is uses and is up to each algorithm developer to set.

When an algorithm developer releases a new minor or major version of the algorithm, they have the option to include a pricing change. Make sure to include the version in your algorithm call to ensure a consistent experience.
{: .notice-info}

#### Algorithms that call other algorithms

Some algorithms build upon other algorithms to create a new service or tool. While this is a powerful way of leveraging the value of multiple algorithms and parallelizing work across the Algorithmia Cluster, such algorithms may incur additional usage costs.

When calling into an algorithm that uses another algorithm internally, you may encounter an additional usage cost at the same 1cr/sec of execution time per core. Additionally, you may incur additional royalty costs if the associated algorithm also charges a royalty. If you are unsure, you can check if the algorithm you are using has the permission set to call into other algorithms as well as the usage history in your account profile. There you will be able to see all charges from algorithm calls.

You can view your last 30-days of account usage on your account page.
{: .notice-info}
