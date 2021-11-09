---
categories: admin-panel
layout: article
title: Workers
---

The Workers page lists information about your cluster's Kubernetes worker nodes. To view the pods running on a worker node, see [Nodes](/developers/administration/admin-panel/nodes).

The table lists the following information:

*   **Name**: the name and IP address of the node
*   **Status**: whether or not the node is ready to handle jobs
*   **Pool**: whether the worker is a CPU or GPU instance
*   **Heartbeat**: the time since the last heartbeat with the control plane
*   **Last Transition**: timestamp of last status transition

To view Grafana charts for a node, click the vertical ellipsis to the right of the corresponding row. To generate a usage report showing the monthly average number of workers consumed on the cluster, navigate to the [System Version](/developers/administration/admin-panel/system-version) page.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616795127683.png)
