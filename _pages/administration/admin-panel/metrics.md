---
categories: admin-panel
layout: article
title: Metrics
---

_Note: This admin panel page opens in a new tab outside of Algorithmia._

The Metrics page, accessed from the System Health panel, is a Grafana dashboard containing several metrics charts. These pre-configured charts display information about API calls, errors, and the timing of API calls in CPU and GPU environments. The pre-configured charts are described below. To learn how to access Grafana, see [Dashboard](/developers/administration/admin-panel/dashboard).

### API calls

*   **API Metrics**: the number of API calls received within the last day and the status of these calls (delineated by color)
*   **Error Rates**: the number of each type (CPU vs. GPU) of error received (delineated by color)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1553793721671.png)

### API call timing

API call timing is presented separately for CPU vs. GPU environments. Each visualization presents the p50 timing, average call overhead, and average queue time in the respective environment.

#### CPU metrics

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1553800730356.png)

#### GPU metrics

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1553800762687.png)