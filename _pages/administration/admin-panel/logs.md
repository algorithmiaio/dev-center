_Note: This admin panel page opens in a new tab outside of Algorithmia._

# Logs

The **Logs** item on the admin panel opens a Kibana dashboard. In the new tab that opens, click on the hamburger menu icon (three horizontal lines) in the upper-left corner to access the navigation bar, and then click **Discover** under the **Analytics** section. The dashboard is also available directly at `https://CLUSTER_DOMAIN/admin/logs/app/discover`, where `CLUSTER_DOMAIN` is the specific domain name of your Algorithmia cluster.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1615319180772.png)

## Setting a custom time range

To set the time range over which to search for logs, click the calendar icon at the top and the text to its right to access a drop-down list of options.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1616690447821.png)

## Searching and filtering

In general, you'll want to set the filter option in the upper-left drop-down menu to the “*” index pattern to start with, so that you see every log from every service. If you need to narrow down your search results for a specific request ID, you can filter them by changing the index pattern to only trace the request within specific services. Expand any log message to see log details, and click on “View Surrounding Documents” to get an understanding of the given request’s journey through Algorithmia's internal services.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628532399991.png)

## General filtering options

In Kibana, you can search and filter logs by account name, algorithm name or version hash, or request ID, among other attributes, as described in the following sections.

When typing in search parameters, pay attention to spaces and quotes in strings, because these characters affect the search results. If your search term has quotes within it, make sure to escape the quotes. For instance, if you're searching for the exact string `request_id":"req-`, you must enter the search term as `"request_id\":\"req-"` in Kibana’s search box.

## Searching by the request ID of an errored algorithm request

To view logs for a specific algorithm error, begin by copying the request ID from the **Errors** tab on the algorithm's profile.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628537810189.png)

In the Kibana search bar, enter the string in double quotes and click **Refresh**. Make sure to adjust the time window as described in [Setting a custom time range](#setting-a-custom-time-range) so that it includes the timestamp of the algorithm execution of interest.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628537911088.png)

## Searching by algorithm name or account name

You can use strings such as account name, algorithm name, and version to search for specific requests in the logs by entering these values in double quotes.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628538120103.png)

## Searching for an algorithm runner's resource hash

To locate the specific resource hash associated with an algorithm runner, search for the "ALGO_OWNER/ALGO_NAME" pair in double quotes and then expand the document by clicking the expand/collapse carat to the left of the entry returned for the specific execution in question.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628538846649.png)

Scroll down the document to retrieve the resource hash.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628538671684.png)

## Viewing event listener logs

Beginning in Algorithmia v20.5.52, cluster admins can view processing logs from the broker manager through the Kibana logs dashboard. To find and view these logs, select “event-listener” from the drop-down menu. There may be duplicate entries in the list; any one of them will work.

Most of the log entries will represent errors, because successfully processed messages are not logged at all. You can further narrow down the log view by selecting only the message field and adjusting the time range as described in the section above. Techniques for filtering the logs further are documented in the official [Kibana docs](https://www.elastic.co/guide/en/kibana/current/index.html).