---
categories: admin-panel
layout: article
title: Source Code Management
---

On Algorithmia, the source code for each algorithm is stored in an individual Git repository, which may include an arbitrary number of files. You can choose to use Algorithmia's internal Git server to host your algorithm source code; this is Algorithmia's default source code management (SCM) system and it's available on all Algorithmia clusters.

You can also use supported third-party SCM providers to host your algorithm source code. The Source Code Management page provides functionality to manage these configurations, which users will then be able to choose between on an algorithm-by-algorithm basis depending on specific project requirements. To learn how to use external SCM configurations with algorithms, see our [SCM docs](https://algorithmia.com/developers/algorithm-development/source-code-management).

Note that if you use a third-party SCM provider to host an algorithm's source code, you won't be able to use our Web IDE to interact with it. Instead, if you navigate to the **Source Code** tab on an algorithm's homepage within the browser UI, you'll be navigated to that algorithm's repository on the website of the SCM provider that's hosting that algorithm's code.

### Viewing SCM configurations

The current SCM configurations on your cluster appear on the **Source Code Management** page.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621527300302.png)

### Creating SCM configurations

We currently have integrated support for the SCM providers listed below. The steps for creating an SCM configuration differ slightly between providers, but the general process is that you'll configure an OAuth application* on the provider's platform, and use the associated key-value pair to create the SCM configuration within Algorithmia using the **Add SCM Configuration** button in the screenshot above. An OAuth application allows individual users to authorize Algorithmia to act on their behalf. We securely store any authorization obtained, and only use it when necessary (such as when creating a new repository for an algorithm). (*Bitbucket server does not use OAuth, as indicated below.)

Click on the respective link below to navigate to the SCM provider-specific configuration documentation. Note that the "build-on-checkin via webhook" providers are configured so that when code is pushed to Algorithmia (checked in to the master branch), a new build is triggered automatically. When pushing code for an algorithm backed by the "direct compile via API" Bitbucket Server provider, a separate API call is required for triggering the actual build. For further description of what this workflow looks like on the side of an algorithm developer, see the [Developer Center docs](https://algorithmia.com/developers/algorithm-development/source-code-management) specific to the provider configuration of interest.

OAuth-based providers:

*   [GitHub / GitHub Enterprise](/managing-advanced-workflows/807370) (build-on-checkin via webhook)
*   [GitLab](/managing-advanced-workflows/807381) (build-on-checkin via webhook)
*   [Bitbucket Cloud](/managing-advanced-workflows/807382) (build-on-checkin via webhook)

Non-OAuth based providers:

*   [Bitbucket Server](/managing-advanced-workflows/805805) (build-on-checkin via webhook)
*   [Bitbucket Server](/managing-advanced-workflows/843874) (direct build via API)

_<span style="color: #7e8c8d;">NOTE: Integrated support for GitLab and Bitbucket (Cloud and Server) is available beginning in Algorithmia Version 20.5.52.</span>_

When a new algorithm source code repository is created on an external SCM platform, Algorithmia grants itself the following permissions:

*   The ability to read (but not write) any source code committed to this repository.
*   The ability to receive webhook events whenever the repository is moved or renamed.
*   The ability to receive webhook events whenever new commits are added to the repository.

These permissions are distinct from those granted to the account that creates the algorithm; for example, that account has repository write permissions. However, these basic permissions ensure that, if the algorithm-owning individual should leave your company, Algorithmia will be able to continue to build new versions of the algorithm they created.

### Managing SCM configurations

Both internal and external SCM configurations can be enabled and disabled as needed, for example to ensure that users leverage the correct configuration for certain algorithms. By default, all new SCM configurations are enabled for all users on the cluster.

To **disable an SCM configuration**, click on the corresponding row in the table and click the "Disable" option in the modal. Once an SCM configuration is disabled, it'll no longer show up as an option for hosting source code for newly created algorithms. Algorithms already created using that specific SCM configuration, however, will continue to function as normal.

To **enable an SCM configuration**, click on the corresponding row in the table for a disabled configuration and click the "Enable" option in the modal.

To **make an SCM configuration the default** that shows up when a user goes to create an algorithm, click on the corresponding row in the table and click the "Make Default" option in the modal. This is useful if you have multiple SCM configurations enabled and would like to guide users to a specific configuration to use.

To **delete an SCM configuration**, click on the corresponding row in the table and click "Delete". You can't delete configurations that are currently serving as the source code host for any algorithms, and you'll receive an error if you try to. If you do get this error, the next best course of action is to disable the SCM configuration as described above. This will hide it from view but allow existing algorithms to continue to function.

Note that an SCM configuration must be disabled before it can be deleted. Also note that Algorithmia's internal SCM configuration can't be deleted, as it forms a core part of the Algorithmia application.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620874306480.png)