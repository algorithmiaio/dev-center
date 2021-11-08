---
categories: admin-panel
layout: article
title: Algorithm Errors
---

The Errors page displays a log of error messages that users on the cluster have received when executing algorithms. These errors are aggregated across all users and consolidated into a single searchable, time-indexed table.

## Understanding errors

For each error, the following information is displayed:

*   **Timestamp**: the exact date and time that the error occurred
*   **Caller**: the account calling the algorithm that resulted in the error
*   **Algorithm**: the name of the algorithm that resulted in the error
*   **Error Type**: the type of error encountered (e.g., `AlgorithmError`, `SystemError`, `UnsupportedError`, `EntityNotFoundError`, etc.)
*   **Error**: the error message itself (displayed in red below the error details)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608505004488.png)

Click the drop-down arrow to the right of an individual row to expose additional details and expanded stack trace information, including the request ID and worker node that handled the request.

## ![Admin Panel - Error stack trace]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1608505148006.png)

## Sorting and filtering errors

At the bottom-right corner of the table is a drop-down list of error types that can be used as a filter on the table. At the top-right corner of the table is a search box for filtering. These filters can be used individually or in tandem to constrain the error records returned.

For more information on how to interpret Algorithmia-specific error types, see the [Errors docs](https://algorithmia.com/developers/algorithm-development/algorithm-errors).

## User-facing errors

Beginning in Algorithmia version 20.5.57, cluster admins have the ability to enable users to see algorithm errors, which in previous versions are only visible through the admin panel. This is a cluster-level feature, meaning it's either enabled or disabled globally on your cluster.

_**Note that this feature exposes stack trace information, including partial algorithm input payloads, to cluster users. This means that enabling this feature entails the possibility of leaking sensitive data from algorithm executions to users who have access to those algorithms.**_

Because of the consideration above, the user-facing errors feature is disabled by default on new Algorithmia installations. The feature can be enabled through the admin API with an [admin API key](https://algorithmia.com/developers/platform/customizing-api-keys#admin-api-keys), using the following cURL command. Note that you must substitute `CLUSTER_DOMAIN` with your Algorithmia cluster domain name (e.g., `algorithmia.com`) and you must substitute a valid value for `ADMIN_API_KEY`.

<div class="syn-code-block">

<pre class="code_snippet">curl -X PUT https://api.**CLUSTER_DOMAIN**/v1/admin/features/algorithm-errors \
  -H 'Content-Type: application/json'
  -H 'Authorization: **ADMIN_API_KEY**'
  -d '{"enabled": true}'
</pre>

</div>

To disable the feature, you can use the same cURL command as above, changing the payload to `{"enabled": false}`.