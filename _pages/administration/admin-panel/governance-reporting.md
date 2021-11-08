# Governance Reporting

Beginning in Algorithmia version 20.5.57, the **Governance Reporting** page provides you with granular reporting capabilities, enabling you to view organization-owned algorithm resource usage at the cluster, organization, and algorithm level. For additional details, see the [Advanced Governance Reporting](https://algorithmia.com/developers/platform/advanced-governance-reporting) docs in our Developer Center.

## Setting cost rates

In order for you to see estimated costs for resource usage, you must first set the expected resource cost rates through the admin panel. If the cost rates haven't been set, all cost estimates will default to 0.

To view current cost rates, click on the **Resource Cost Rates** dropdown in the upper-right corner.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623360789374.png)

To set the cost rates for the first time, or to modify the current values, click on the **Edit Values** button in the dropdown.

Cost rates can be specified to the ten thousandth of a cost unit (i.e., 0.0001). Configurable cost rates include:

*   GPU time (cost / GPU second)
*   CPU time (cost / CPU second)
*   Algorithmia-hosted data transfer (cost / GiB)
*   Externally hosted (through data connector) data transfer (cost / GiB)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623360962360.png)

## Pulling and viewing usage data

As a cluster admin, you have access to all information captured within the platform. Data can sliced and diced temporally and/or grouped by organization, account, or organization-owned algorithm, as needed. Specific metrics can be selected to be <span style="font-family: inherit; font-size: 1em;">visualized in the plot. Below the plot, all metrics are displayed in tabular form and ordered by the selected metric to help you understand resource usage within the specified time period.</span>

### Selecting the date range

The first dropdown enables you to select a time range for which you'd like to pull and display usage data. You can select a predefined time duration from the present or a recent month, or you can specify specify a custom date range as shown in the screenshots below.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623361669450.png)

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623361713877.png)

<span style="font-family: inherit; font-size: 1em;">Note that cluster-wide usage data is only aggregated once per day. This means that the aggregated data has day-level granularity, from midnight to midnight as indicated in the screenshot above.</span>

### Selecting the grouping level

In the second dropdown, you can select the level at which you'd like the data to be grouped. The following screenshot shows the algorithm-level view.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623361562447.png)

### Selecting a metric

In the third dropdown you can select the metric for which you'd like to view data; the metrics available are displayed in the screenshot below, and more information about these metrics is available in the [Advanced Governance Reporting](https://algorithmia.com/developers/platform/advanced-governance-reporting#metrics) docs in our Developer Center.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1623361756199.png)

### Sorting and exporting data

The fourth dropdown can be used to sort the table in ascending or descending order.

To export the data for further analysis, reporting, chargeback, and other governance uses, click the **Download CSV** button at the upper-right corner of the plot.