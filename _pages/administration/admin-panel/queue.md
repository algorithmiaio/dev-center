---
categories: admin-panel
layout: article
title: Queue
---

_Note: This admin panel page opens in a new tab outside of Algorithmia._

The Queue page, which can be accessed from the System Health panel, is a Grafana dashboard that provides a live visual display of the internals of Algorithmia's scheduling system. Queueing typically occurs when the number of requests exceeds the capacity of the cluster's worker nodes. Algorithmia's scheduling system uses a RabbitMQ message broker and a FIFO (first in first out) queueing protocol—requests are processed in the order in which they are received.

![Admin Panel - Grafana Queue Overview]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608589248005.png)

Live summary statistics are displayed across the top of the dashboard. To view a more granular picture of the data, click on the title of the box containing the desired statistic, and navigate down the drop-down menu to the "Inspect" option and select either "Data" (for the ability to download the data in CSV format) or "Panel JSON" (to view the JSON content).

![Admin Panel - Grafana Data Export]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608593685619.png)

At the top-right corner of the dashboard, click on the drop-down list with the clock icon to change the time range for which metrics are displayed. Time ranges can be chosen as relative ranges (e.g., "Last 15 minutes") or as absolute ranges (e.g., "2020-12-14 00:00:00 to 2020-12-14 23:59:59").

![Admin Panel - ]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608589946153.png)

To change the frequency at which the Grafana charts are updated, click the drop-down at the top-right corner of the screen and select the desired time frequency. If the refresh frequency is set to "Off", the charts will not update unless refreshed manually by clicking the circular refresh icon next to the drop-down.

![Admin Panel - Refresh Frequency Selection]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608589588440.png)

The remainder of the page contains charts for the summary statistics displayed at the top. These include visualizations for queued, incoming, and outgoing messages, and for queues, channels, and connections. To collapse a chart vertically, click the arrow to the left of its heading.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608590626419.png)

![Admin Panel - Grafana Nodes]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608590492233.png)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608590590932.png)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608590664171.png)