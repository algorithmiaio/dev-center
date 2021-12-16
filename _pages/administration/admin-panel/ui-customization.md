---
categories: admin-panel
layout: article
title: UI Customization
---

The UI Customization page provides functionality for customizing the appearance of the platform interface for users on your cluster. The following customization options are available:

*   **Favicon**: the icon that appears in the browser tab; to reset, click "Change" and select a local image file such as a PNG
*   **Brand Logo:** the image that appears at the top of the navigation bar; to reset, click "Change" and select a local image file such as a PNG
*   **Brand Title:** the text that appears at the top of the navigation bar under the brand logo
*   **Brand Color:** the color of the navigation bar, in hexadecimal (`#RRGGBB`) format
*   **Library Title:** the title of the navigation bar menu item that points to the algorithm repository; defaults to "Algorithms"

When the desired changes have been made, click "Save Changes" and refresh the page to see the changes take effect. It may take several seconds for the changes to propagate across the system.

![Admin Panel - UI Customization]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609365483178.png)

## Enabling/disabling dark mode

Beginning in Algorithmia version 21.3, administrators can enable dark mode at the cluster level. The feature can be enabled through the admin API with an [admin API key](/developers/platform/customizing-api-keys#admin-api-keys), using the following cURL command. Note that you must substitute `CLUSTER_DOMAIN` with your Algorithmia cluster domain name (e.g., `algorithmia.com`) and you must substitute a valid value for `ADMIN_API_KEY`.

<div class="syn-code-block">

<pre class="code_snippet">curl -X PUT https://api.CLUSTER_DOMAIN/v1/admin/features/dark-theme-enabled \
  -H 'Content-Type: application/json'
  -H 'Authorization: Simple ADMIN_API_KEY'
  -d '{"enabled": true}'
</pre>

</div>

To disable the feature, you can use the same cURL command as above, changing the payload to `{"enabled": false}`.
