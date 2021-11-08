---
categories: admin-panel
layout: article
title: Reservations
---

A reservation is an assigned worker node slot pre-loaded with an algorithm instance, which includes any underlying model file, data, and code dependencies. The Reservations page provides an interface for managing reservations on your cluster.

## Use cases for reservations

The overall purpose of reservations is to eliminate algorithm cold-starts; it might be advantageous to configure them for the following scenarios:

*   **Infrequently called algorithms**: If you call an algorithm that has not handled a request in some time, it must start "cold", meaning it must first load any model and code dependencies into memory, which requires some overhead start-up time. After you call an algorithm, it remains warm (loaded into memory in a worker node slot) and ready to receive new workloads for some time, but if it doesn't receive other requests, it is eventually terminated to make room for other workloads. If an algorithm is only called infrequently, you'll experience this "cold start" delay every time you call it. If you have latency requirements, you can configure a reservation for this algorithm, so that it can sit warm and ready to handle requests.
*   **Large algorithms**: Algorithms built from large images can take an especially long time to load. This issue can be eliminated by configuring reservations so that heavy dependencies remain loaded into memory. A good rule of thumb is that if you have model files and code dependencies that together bring the image size to over ~100 MB, a reservation is recommended.

## Configuring reservations

The Reservations page contains a table listing the reservations that are currently configured on your cluster.

![Admin Panel - Reservations]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609359537322.png)

For security reasons, algorithm instances are not shared across accounts, even when two users call the same algorithm at the same time. Because of this, Algorithm reservations must be configured on a per-account basis.

To add a reservation, click the "Add Reservation" button at the top-right corner of the table and complete the following fields in the modal before clicking "Submit":

*   **Calling user**: the name of the account or org that'll be calling the reserved algorithm
*   **Algorithm:** the name of the account or org that owns the algorithm and the name of the algorithm, in the format `ALGO_OWNER/ALGO_NAME[/ALGO_VERSION]`;
    *   If the "version type" selected is one of the "Latest *" options, `ALGO_VERSION` should not be specified
    *   If the "version type" selected is one of the "Specific *" options, `ALGO_VERSION` should be specified as described below the screenshot
*   **Version type:** the type of version specified in the "algorithm" field (see descriptions below)
*   **Number of reservations:** a positive numeric value indicating the number of algorithm replicas to keep warm 

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617229501770.png)

You may specify a semantic version or version hash to indicate a specific version of an algorithm that you'd like to keep warm. <span style="font-family: inherit; font-size: 1em;">As the screenshot below illustrates, some of the "Version Type" options are only relevant to the owner* of the algorithm in question, as only that account will have the permissions required to access private or unpublished algorithms under their account. (*Algorithms owned by an organization may have multiple accounts with access.) The available options are as follows:</span>

*   **Latest PUBLIC version:** the latest version on the cluster that is published publicly (published with the "Public" option selected under "Callability" settings)
*   **Latest PRIVATE version:** the latest version that is published privately (published with the "Private" option selected under "Callability" settings)
*   **Latest compiled version:** the version that was most recently compiled, regardless of whether or not the Algorithm has been published
*   **Specific semantic version:** a specific numbered semantic version (e.g., `0.1.2`); if this option is selected, the version `ALGO_VERSION` should be specified in the "Algorithm" field (i.e., `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`)
*   **Specific version hash:** a specific Git hash (e.g., `cf0da600c70d0970a4de0bd9d5441c7666c4fafa`); if this option is selected, the version `ALGO_VERSION` should be specified in the "Algorithm" field (i.e., `ALGO_OWNER/ALGO_NAME/ALGO_VERSION`)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1618942213930.png)

To remove a reservation, click the action menu for the reservation in question and click "Remove reservation".

![Admin Panel - Remove Reservation]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609359637045.png)

If you'd like to configure reservations programmatically, you can do so using an admin API key with [this Python code](https://gist.github.com/zeryx/5d4f89029c15b92b127bcb82808d412a).