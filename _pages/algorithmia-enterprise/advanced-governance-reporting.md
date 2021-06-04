---
layout: article
title:  "Advanced Governance Reporting"
excerpt: "Gain insight into platform usage and enhance ML governance with Algorithmia's advanced reporting capabilities"
excerpt-short: "Algorithmia advanced reporting for governance"
categories: [algorithmia-enterprise]
tags: [algorithmia-enterprise]
show_related: false
permalink: /algorithmia-enterprise/advanced-governance-reporting/
redirect_from:
-  /basics/advanced-reporting/
---

Advanced governance reporting provides functionality to aggregate algorithm execution metrics and make them searchable in order to easily review resource usage at the algorithm, account, and organization level.

This feature is only available to users on [Algorithmia Enterprise](/enterprise) clusters where the feature has been enabled. The feature is available beginning in Algorithmia version 20.5.53.
{: .notice-enterprise}

## Use Cases

- View historical information about system resource usage at the algorithm, account, and organization level.
- Support chargeback/showback efforts with report granularity down to the level of specific algorithm versions.

## Metrics

Governance reports contain both historical and aggregate data. Historical data is a roll-up from a time window of algorithm executions, while aggregate data represents a snapshot from the time the report is generated. The following metrics are displayed in governance reports:

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

## Setting cost

In order to see calculated cost information, a cluster admin must first set the expected cost of resources. If the expected cost hasn't been set, all costs will default to 0.

![Setting cost](/developers/images/post_images/advanced_reporting/governance_reporting_set_cost.png)

Configurable expected cost rates* include:
- GPU time (cost / GPU second)
- CPU time (cost / CPU second)
- Algorithmia-hosted data usage (cost / GiB)
- Externally hosted (through data connector) data usage (cost / GiB)

*Cost rates can be specified to the ten thousandth of a cost unit (i.e., 0.0001)

![Showing cost](/developers/images/post_images/advanced_reporting/governance_reporting_view_cost.png)

## Permissions

### Cluster admin

Cluster admins can view all information captured within the platform.

![Cluster admin page](/developers/images/post_images/advanced_reporting/governance_reporting_cluster_admin.png)

These data can be grouped by organization, organization-owned algorithm, or account as needed.

![Group by selector](/developers/images/post_images/advanced_reporting/governance_reporting_groupby_list.png)

These data can be visualized as a whole and displayed in tabular form ordered by any of the above-listed metrics in order to help understand system usage within the specified time period.

![Tabular data](/developers/images/post_images/advanced_reporting/governance_reporting_tabular.png)

### Organization admin

Organization admins can view information for their current organization. Information can be viewed for the organization as a whole or grouped by organization-owned algorithms or member accounts if needed.

This data can be visualized as a whole and can then be ordered in tabular form by any of the above-listed metrics in order to help understand system usage within a specified time period.

![Org admin page](/developers/images/post_images/advanced_reporting/governance_reporting_org_report.png)

#### Algorithm details

Organization admins can also view information about usage for a specific version of an algorithm owned by their organization. Algorithm usage metrics can be viewed at the organization level or grouped by the individual accounts calling the algorithm.

![Algorithm details page](/developers/images/post_images/advanced_reporting/governance_reporting_algorithm_report.png)
