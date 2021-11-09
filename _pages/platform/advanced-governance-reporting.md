---
categories: basics
excerpt: "Gain insight into platform usage and enhance ML governance with Algorithmia's advanced reporting capabilities"
excerpt-short: "Algorithmia advanced reporting for governance"
layout: article
permalink: /platform/advanced-governance-reporting/
show_related: false
redirect_from:
  - /basics/advanced-reporting/
  - /algorithmia-enterprise/advanced-governance-reporting/
tags: [platform]
title: "Advanced Governance Reporting"
---

Advanced governance reporting provides functionality to aggregate execution metrics for organization-owned algorithms and make them searchable in order to easily view and report on resource usage at the algorithm, account, organization, and cluster level.

This feature is only available to users on [Algorithmia Enterprise](/enterprise) clusters where the feature has been enabled. The feature is available beginning in Algorithmia version 20.5.57.
{: .notice-enterprise}

## Use cases

- View historical information about system resource usage at the algorithm, account, and organization level.
- Support chargeback/showback efforts with report granularity down to the level of specific algorithm versions.

## Metrics

Governance reports contain both historical and aggregate data. Historical data is a roll-up from a time window of algorithm executions, while aggregate data represents a snapshot from the time the report is generated. The data-aggregation job is run daily on the cluster, so the aggregated data has day-level granularity, from midnight to midnight. The following metrics are available in governance reports:

Historical data
- Algorithmia-hosted storage size (MiB)
- Data connector storage size (MiB)
- CPU core usage (duration of CPU core usage only, in seconds)
- CPU time (duration of total CPU-based execution in seconds, which includes CPU core usage)
- GPU time (duration of GPU-based execution in seconds)
- CPU cost
- GPU cost
- CPU memory usage (MiB)
- GPU memory (MiB)
- Algorithm execution count
- Algorithm error count

Aggregate data (aggregated at the organization level)
- Organization member count
- Organization-owned algorithm count

![Metrics drop-down](/developers/images/post_images/advanced_reporting/governance_reporting_metrics_list.png)

## Permissions

The governance reporting feature is available to cluster admins and organization admins. In order for cost information to be estimated, a cluster admin must first [set expected resource cost rates](/developers/administration/admin-panel/governance-reporting#setting-cost-rates). If the cost rates haven't been set, all estimated costs will default to 0.

### Cluster admin

Cluster admins can view all resource consumption data captured within the platform, grouped by organization, account, and algorithm. They can also view everything that an organization admin can view, as described below. For more details, see the [cluster admin docs](/developers/administration/admin-panel/governance-reporting#pulling-and-viewing-usage-data).

### Organization admin

Organization admins can view resource consumption data for organizations for which they're an admin, for members of those organizations, and for algorithms owned by those organizations.

#### Organization-level reporting

From the **Reporting** tab of an [organization's profile]({{site.baseurl}}/platform/organizations), data can be grouped by organization-owned algorithm or member account as needed.

![Org admin org report](/developers/images/post_images/advanced_reporting/governance_reporting_org_report.png)

Each metric listed above can be visualized by selecting it in the third dropdown, as shown above under [Metrics](#metrics). All metrics are also displayed in tabular form below the plot, ordered by the selected metric, in order to help you understand resource usage within a specified time period.

![Org admin tabular data](/developers/images/post_images/advanced_reporting/governance_reporting_tabular_report.png)

#### Account-level reporting

Organization admins can navigate to the **Reporting** tab of the [account profile]({{site.baseurl}}/platform/account-profile/) for an account that's a member of the organization to see that specific account's resource usage. At the account level, data can be grouped by organization or algorithm.

![Org admin account report](/developers/images/post_images/advanced_reporting/governance_reporting_account_report.png)

#### Algorithm-level reporting

Organization admins can also navigate to the **Reporting** tab of the [algorithm profile]({{site.baseurl}}/platform/algorithm-profile/) for an algorithm owned by their org to view information about usage for that specific algorithm. Algorithm usage metrics can be displayed at the organization level or grouped by the individual organization member account calling the algorithm.

![Org admin algorithm report](/developers/images/post_images/advanced_reporting/governance_reporting_algorithm_report.png)
