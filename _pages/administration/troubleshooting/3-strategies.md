---
categories: troubleshooting
layout: article
title: "3) Strategies"
---

## Debug an algorithm in another account

In order to debug effectively, it's often easiest to recreate an algorithm in another account so that you don't need to worry about modifying the source code and/or settings of the original algorithm. If you do choose to recreate an algorithm in another account for troubleshooting purposes, you can follow the steps below to make sure you aren't missing any pieces.

1.  With [super powers enabled](/developers/administration/admin-panel#enabling-super-powers) as an admin, navigate to the account that owns the problem algorithm.
2.  Obtain the algorithm's source code, dependencies, and environment information. There are two ways to do this:
    1.  Migrate the source code as a whole [using an automated workflow](/developers/administration/admin-config/migration-scripts/#workflow-for-algorithm-migration-or-promotion), or
    2.  Manually copy the source code and dependencies into a new algorithm. You can get the source code and dependencies from within the Web IDE, and the runtime environment is listed under the **Settings** tab on the algorithm profile. Create a new algorithm with the same environment under your own account, and in the Web IDE, paste in the cloned source code and dependencies under this new algorithm.
3.  Check the data sources with which the algorithm interacts. If it’s reading data from a hosted data collection, for example, you’ll need copies of those files under your own account, and if it’s writing to a hosted data source, you may need to create the target collection(s). To make copies of data and collections:
    1.  Navigate to the **Users** page on the admin panel.
    2.  Find the account that owns the data and [impersonate that account](/developers/administration/admin-panel/users#impersonating-other-accounts).
    3.  Go to the relevant data collections, download the files, create your own data collections to mirror them, upload files to your collections, etc., as necessary.
    4.  Update the source code of the recreated algorithm to point to the cloned data sources as necessary.

## Inspect Kibana

Every Algorithmia Enterprise installation comes provisioned with Kibana, a tool for querying and visualizing log data. To learn how to navigate to your Kibana dashboard and use its powerful functionality for troubleshooting, see the [Logs](/developers/administration/admin-panel/logs) lesson.

## Inspect Grafana

Every Algorithmia Enterprise installation comes provisioned with Grafana, a tool for visualizing numeric metrics. To learn how to navigate to your Grafana dashboard and use its powerful functionality for troubleshooting, see the [Dashboard](/developers/administration/admin-panel/dashboard) lesson.

# Inspect a browser request/response

An effective way to investigate API requests and responses to and from Algorithmia is by using your browser's developer tools. In the Chrome browser, for example, you can [inspect network activity using Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network). Other browsers have similar functionality as well.

To see how this works with an Algorithmia platform request in Chrome, turn on Chrome DevTools by right-clicking on an element on the page and selecting "Inspect". In the DevTools sidebar, click on the **Network** tab. Now navigate to your profile in Algorithmia's browser UI and try to create a new algorithm, observing the network activity as the page renders. You'll see, for example, a request made to the `environments` endpoint of the Algorithmia API, as well as the details of the server's response. As shown below, you can "Copy as cURL" to get the request URL and other headers for further troubleshooting. Note that you may need to refresh the page in order for the network activity to be populated if the Network tab is not opened when the request is made.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628551260737.png)
