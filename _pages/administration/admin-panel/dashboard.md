---
categories: admin-panel
layout: article
title: Dashboard
---

The Dashboard page displays an overview of your cluster's capacity usage and overall health. The metrics are collected using [Prometheus](https://prometheus.io/), an open-source systems-monitoring and alerting tool originally built at SoundCloud. The metrics collected by Prometheus are visualized in your Algorithmia instance using [Grafana](https://grafana.com/grafana), an open-source real-time metrics-visualization and alerting tool that is bundled with your Algorithmia installation.

## Grafana dashboard

We've embedded several pertinent Grafana charts into the Dashboard page in your admin panel. As part of your Algorithmia installation, you also have access to many additional Grafana charts through a designated Grafana dashboard, and this is where you can also configure alerts to warn you when various thresholds are exceeded.

Your Grafana dashboard can be found at `https://grafana.CLUSTER_DOMAIN`. For example, as shown in the second screenshot below, you'd insert `grafana.` after the protocol (`https://`) portion of your cluster's domain name. Note that your Grafana URL may not conform to this structure exactly; please contact your Customer Success Manager or Solutions Engineer if you are unable to access Grafana. Once you have access to your Grafana dashboard, you can configure custom reports and charts.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616017938046.png)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616100492876.png)

The full list of available dashboards can be found at the `/dashboards` endpoint of your Grafana page (i.e., `https://grafana.CLUSTER_DOMAIN/dashboards`). You can also access the list of dashboards through **Dashboards** → **Manage** on the left-hand navigation bar.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624308936510.png)

## Logging in to the embedded Grafana charts

If you log in to your Algorithmia admin panel and see Grafana's login screen in the embedded chart component, simply type in your credentials and Grafana charts will render with your real-time data. If the charts don't show up immediately after logging in to Grafana, refresh the page and the embedded charts should render.

## Understanding the dashboard

### Overall health

This section displays information about your cluster's health and activity. The chart displays the number of API calls over the last 24 hours, and information for the following services:

*   **API-Server**: the number of healthy API servers
*   **Legit**: the health status of Algorithmia's internal source code management system
*   **Pyrometer**: the health status of Algorithmia's metrics aggregation and synchronization service
*   **Web-Server**: the number of healthy web servers

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617388987603.png)

### Capacity overview

Your Algorithmia instance is configured with a number of worker node instances that process algorithm execution requests, and each of these instances has a certain number of "slots" available. A separate algorithm instance can run in each of these slots. The number of slots available on a given worker node depends on the worker node type and the memory and disk requirements of the algorithms running on it. The Capacity Overview section displays the amount of slot usage by CPU and GPU execution environment.

Algorithmia scales worker node capacity in and out depending on cluster usage, and we've built in optimizations to minimize latency while balancing cost and performance. At a high level, as current worker usage is approaching capacity, we add worker instances to meet predicted near-term future demand, and in turn remove instances when demand declines. As the available slots fill up on each worker node, if the cluster continues to receive algorithm requests, we spin up new nodes to increase capacity.

In the case that full capacity is reached across worker nodes and no more nodes are available to create because of the current cluster configuration settings, any subsequent API requests are queued at the scheduler. This manifests as latency, and the caller must wait until a slot is available to handle the request. For example, if the platform is configured so as not to scale past 5 worker nodes, and those 5 nodes are all at capacity executing algorithms, any subsequent requests are queued until one of the current jobs completes.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1553791200938.png)

Grafana dashboards can be accessed through **Admin** → **Metrics** | **Queue**. To view a specific dashboard, for example the "Algorithm Status" dashboard, you can search for it using the search box on the left-hand navigation bar.

## Finding a specific algorithm’s runner resource hash

There are a few ways to find the runner resource associated with an algorithm execution. If you can find the specific execution under **Admin** → **Algorithm Executions** in the Algorithmia browser UI, click on the entry and copy the first hexadecimal part of the string. In the example below where the algorithm replica name is `algorithm-runner-34961ca801-6b5686fd8f-nr7v4`, the resource hash would be the `34961ca801` part.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628549934477.png)

If you can’t find it on the **Algorithm Executions** page, [search for the resource hash in Kibana](/developers/administration/admin-panel/logs#searching-for-an-algorithm-runners-resource-hash).

## Check the algorithm status dashboard

Once you've identified the resource hash as described above, enter it on the Algorithm Status dashboard and check the algorithm’s operational widgets.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628550602760.png)