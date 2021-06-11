---
layout: article
title:  "Advanced Governance Reporting"
excerpt: "Gain insight into platform usage and enhance ML governance with Algorithmia's advanced reporting capabilities"
excerpt-short: "Algorithmia advanced reporting for governance"
categories: [platform]
tags: [platform]
show_related: false
permalink: /platform/advanced-governance-reporting/
redirect_from:
  - /basics/advanced-reporting/
  - /algorithmia-enterprise/advanced-governance-reporting/
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

## Permissions

The governance reporting feature is available to cluster admins and organization admins. In order for cost information to be estimated, a cluster admin must first [set the expected resource cost rates](https://training.algorithmia.com/exploring-the-admin-panel/836479#setting-cost-rates). If the cost rates haven't been set, all estimated costs will default to 0.

### Cluster admin

Cluster admins can view all resource consumption data captured within the platform. For more details, see the [cluster admin docs](https://training.algorithmia.com/exploring-the-admin-panel/836479).

### Organization admin

Organization admins can view information for their current organization. Information can be viewed for the organization as a whole or grouped by organization-owned algorithms or member accounts as needed.

Each metric listed above can be visualized by selecting it in the third dropdown.

![Org admin page](/developers/images/post_images/advanced_reporting/governance_reporting_org_report.png)

All metrics are also displayed in tabular form below the plot, ordered by the selected metric from the dropdown, in order to help you understand resource usage within a specified time period.

![Org admin tabular data](/developers/images/post_images/advanced_reporting/governance_reporting_tabular.png)

#### Algorithm details

Organization admins can also view information about usage for a specific version of an algorithm owned by their organization. Algorithm usage metrics can be viewed at the organization level or grouped by the individual accounts calling the algorithm.

![Algorithm details page](/developers/images/post_images/advanced_reporting/governance_reporting_algorithm_report.png)
