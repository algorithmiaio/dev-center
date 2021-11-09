---
categories: admin-panel
layout: article
title: Algorithm Executions
---

On your cluster, there may be tens, hundreds, or even thousands of algorithm instances running at any given moment. The Algorithm Executions page provides a cluster-wide snapshot view of these running instances, displaying execution counts grouped by algorithm and caller (i.e., user account). Metrics are aggregated at the caller-by-algorithm version hash level, meaning that counts are listed for each individual algorithm build invoked by each individual caller. To view historical algorithm-execution data, see [Governance Reporting](/developers/administration/admin-panel/governance-reporting/).

![Admin Panel - Algorithm Executions]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608485000992.png)

## Understanding execution metrics

The execution metrics table lists the following information:

*   **Algorithm**: the account that owns a given algorithm, along with the hash version of the algorithm
*   **Caller**: the account used to call a given algorithm, either directly or internally through another algorithm (the account is determined by the API key used to call the algorithm)
*   **Current Replicas**: the number of concurrent algorithm instances currently loaded for a given algorithm for each specific caller
*   **Max Replicas**: the maximum number of algorithm instances available for a given algorithm for each specific caller
*   **Reserved**: the number of warm algorithm instances for a given algorithm for each specific caller (see [Reservations](/developers/administration/admin-panel/reservations) to learn why you might want to use reserved instances, and how to configure and manage them)

To revert the table to the default sort order and update the algorithm execution counts, click the refresh icon at the top-right corner. To view details for a specific algorithm version hash and caller, click on the corresponding row in the table.

![Admin Panel - Algorithm Executions Example]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608488577239.png)
