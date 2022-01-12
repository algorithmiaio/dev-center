---
categories: admin-panel
layout: article
title: Users
---

The Users page provides functionality for managing and debugging issues that arise related to specific accounts, sending notifications within the platform, and setting concurrent session limits. To download information for all the accounts on your cluster, click the "Download CSV" button. 

To access the functionalities provided on this page, search for an account by the username or email and then click the action menu for the account as indicated in the screenshot below.

![Admin Panel - Users]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609277500649.png)

## Sending in-platform notifications

To send a notification to an account, click the "Send notification" option in the drop-down list. As shown in the screenshot below, you may specify multiple usernames separated by commas to send the same notification to multiple accounts.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617039346851.png)

Users authenticated into the browser UI are alerted of notifications in the lower-left corner of the screen, where a badge on the bell icon specifies the number of unread notifications. Click on the bell to access the notifications list. If a URL is supplied as part of a notification, clicking on the notification entry in the list will navigate to that page.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617039541964.png)

## Setting work limits

As a security, cost-control, and performance-management feature, as an admin you can limit the number of concurrent sessions (connections from a single account) that any given account is able to initialize. For instance, you may choose to throttle down an account's active session limit to control costs, or throttle it up to enabled increased degrees of parallelism.

The maximum concurrent session limit defaults to 80. There's no predefined upper-bound to this limit; to determine what a reasonable upper-bound is for your cluster, you'll need to take into account <span style="font-family: inherit; font-size: 1em;">cluster- and workload-specific</span> <span style="font-family: inherit; font-size: 1em;">considerations such as</span><span style="font-family: inherit; font-size: 1em;">how many workers are available, the resource requirements of specific algorithms you'll be calling (which will determine how many replicas can run</span> <span style="font-family: inherit; font-size: 1em;">on the same machine), and the execution durations of the algorithms you'll be calling.</span>

To change an account's concurrent session limit, click on the action menu and select "Update Work Limits" from the drop-down list. In the modal, enter a positive integer to set a new limit and select the "Update" button to submit the changes.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617040330708.png)

If an attempt is made to initialize a connection that results in the number of concurrent sessions exceeding the maximum number configured for that account (or the default limit if not set explicitly), the request will fail.

## Debugging

The Algorithmia platform provides the admin role with two capabilities that can aid in debugging issues with accounts and account-owned resources such as algorithms and data. The sections below describe these features.

### Enabling super powers

As a cluster admin, you have the ability to grant yourself "super powers", which gives you the ability to see information that would otherwise be private and only viewable when logged in to a specific account. In this mode, if you navigate to another account's homepage, or the homepage of an org of which you're not a member, you'll be able to see algorithm settings and source code for private and closed-source algorithms.

To enter this mode, click the user icon at the lower-left corner of the screen and click the "Enable Super Powers" option.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617040679403.png)

When super powers are enabled, a banner will show up at the top of the screen to remind you that you're in this mode of elevated privileges. To disable super powers and return to the normal mode, click "Disable" on the banner. If you've already closed the banner, click the same user icon at the lower-left corner and select "Disable Super Powers".

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617040733749.png)

### Using sudo privileges

Sudo privileges can be used to call private versions of algorithms owned by other accounts. To call an algorithm with sudo privileges, add the `?sudo=true` parameter to the endpoint URL in the API call.

This can be useful for testing and debugging, and can help to avoid several less-than-ideal debugging work-arounds. For example, you can use the `sudo` flag to avoid having to "impersonate" another account (see section below) and/or use API keys from other accounts, which makes it impossible to correctly attribute usage. It also makes it unnecessary to publish an algorithm publicly or add an account to a particular org just to enable that account to temporarily call a specific algorithm.

When you call algorithms with the `sudo=true` flag, you call the algorithm **_as if_** you're calling it from the owning account, so you get access to private data and private versions. For example, if the algorithm uses `data://.my/foo`, `.my` will refer to the algorithm owner, not the caller (your account, in this case) like usual. Sudo calls show up in the logs with the sudo flag, but the usage data isn't attributed to the account that actually owns the algorithm.

### Impersonating other accounts

As a cluster admin, you also have the ability to "impersonate" other accounts on your cluster in order to see the platform through the eyes of a user authenticated into that account. This can be valuable for debugging account-specific issues, for accessing account-owned data, and for being able to experience the UI from the perspective of a specific non-admin account without needing to exchange credentials.

As a word of caution, when you impersonate an account, you're granted any and all permissions that account has, and anything you do on the platform is recorded as if the impersonated account is taking the action. Therefore, it's important to exercise caution when impersonating, and "Stop" impersonating once you have completed the desired action. We generally recommend avoiding the impersonation feature as much as possible and first trying the "super powers" feature described above. Only use the "impersonate" feature as a last resort, when the super powers feature does not get you the information you need.

To impersonate an account, click the action menu on the row of the account you wish to impersonate and click "Impersonate user" to assume that role on the cluster. When you're actively impersonating, a banner appears at the top of the page to remind you. To end the impersonation session, click the "Stop" button in the banner, or simply log out of your account.

Note that, for security reasons, if you're actively impersonating a cluster admin account and you want to impersonate account, you must first "Stop" impersonating the first account before trying to impersonate the second. If you do try to impersonate a second account from within an impersonation session, you'll be logged out of the platform and may need to clear application cookies before being allowed to re-authenticate.

![Admin Panel - Users - Impersonate User]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609284497795.png)

### Managing roles

To grant cluster admin privileges to a non-admin account, click the action menu for the account and select the "Add to admins" option in the drop-down list.

As a cluster admin, you also have the ability to delete accounts if needed using the "Delete user" option. Proceed with caution, because once a username and email have been used on the platform, they may not be used again with a new account.

To disable the "sudo user" role on the cluster, set the `process.env.IS_SUDO_USER_ENABLED` environment variable to `false`. When the role is disabled, the following will be true:

1.  "Sudo" won't show up as a user role in the Users page.
2.  Cluster admins won't have the menu option to "Add to Sudo Users" or "Remove from Sudo Users" on the Users action menus for each user in the Users page.
3.  The entire "Sudo users" section and "Add sudo user" input will be hidden in the UI on the [Administrators](/developers/administration/admin-panel/administrators) page.
