---
categories: admin-config
layout: article
title: Manage User Roles
---

*   [Cluster viewer](#overview-of-the-cluster-viewer-role)
*   [Organization executor](#overview-of-the-organization-executor-role)

## Overview of the "cluster viewer" role

Beginning in Algorithmia version 21.1.1-1, the "cluster viewer" role can be assigned to Algorithmia user accounts to grant them a read-only subset of admin permissions. A cluster viewer has a full view of _activity_ on the cluster, allowing them to inspect the cluster's health and operating status without granting them permissions to modify or delete cluster resources. Specifically, a cluster viewer may:

*   View, but not modify, platform configuration.
*   View, but not modify or impersonate, users.
*   View, but not modify, permissions related to the usage of the platform.

The screenshots below are provided as an example to demonstrate the difference between the functionality available to a normal admin and that available to an admin with the cluster viewer role assigned. When a normal admin navigates to the Secret Store page in the admin panel, they have the ability to take actions (e.g., create, update, delete) on secret providers.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1629302657998.png)

An admin with the cluster viewer role assigned, however, only has viewing permissions.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1629302738308.png)

### Adding the cluster viewer role to a user account

To add the cluster viewer role to a user account, you can use the following command. Note that you'll need to substitute `ACCOUNT_NAME` with the name of the account to be assigned the cluster viewer role, and you'll need to supply an admin API key. Also note that `CLUSTER_DOMAIN` does not contain the `api.` component (e.g., just `algorithmia.com` and not `api.algorithmia.com`).

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/admin/roles/ACCOUNT_NAME/cluster_viewer \
    -X POST \
    -H 'Authorization: Simple ADMIN_API_KEY'
</pre>

</div>

### Removing the cluster viewer role from a user account

To remove the cluster viewer role so that a user account regains standard user privileges, you can delete the role with the following command. Note that you'll need to substitute `ACCOUNT_NAME` with the name of the account from which to remove the cluster viewer role, and you'll need to supply an admin API key. Also note that `CLUSTER_DOMAIN` does not contain the `api.` component (e.g., just `algorithmia.com` and not `api.algorithmia.com`).

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/admin/roles/ACCOUNT_NAME/cluster_viewer \
    -X DELETE \
    -H 'Authorization: Simple ADMIN_API_KEY'
</pre>

</div>
### Using SAML to manage the cluster viewer role

You can also complete the configuration shown above using SAML sync instead of an admin API key. The sync group IDs can be set with the `org_mgmt_cluster_viewer_group_id` installer variable.

## Overview of the "organization executor" role

Beginning in Algorithmia version 21.1.14, the "organization executor" role can be assigned to Algorithmia user accounts in order to grant them limited permissions within a given organization. This role grants a user the ability to execute algorithms and to view algorithm build and execution logs, but org executors aren't considered members of the organization in which they're granted these permissions.

Org executors have read-only permissions to org data as well as algorithm metadata and settings, but can't view algorithm source code. They can also access specific algorithm-profile tabs such as **Overview**, **Docs**, **Discussion**, and **Builds**.

Note that this role is assigned to users in the context of individual orgs and not the entire cluster, and that users may be org executors in multiple orgs. For instance, a user may be a normal member of `orgA` (with normal permissions to read, modify, and execute algorithms within `orgA`), but an org executor in `orgB` and `orgC` (with permissions only to execute algorithms and view logs within `orgB` and `orgC`).

### Adding the organization executor role to a user account

To add the org executor role to a user account, that user must be part of a group in your Identity Provider system, and you must provide that group identifier as a value in the `external_executor_group` variable when creating or updating the target Algorithmia organization. This variable is an array, and the org executor role will be added to all accounts in all groups listed in the array. Those accounts will be added to the `org_name` organization as members with org executor permissions.

Org executors don't have the ability to create org-owned API keys, but can create standard API keys for themselves as a normal user can. 

This action requires cluster administrator privileges. A sample API request to add the accounts defined in the `myExecutorGroup1` and `myExecutorGroup2` groups (defined in environment variables) is as follows:

**REST request**

<div class="syn-code-block">
<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/v1/organizations \
    -X POST \
    -H "Authorization: ADMIN_API_KEY" \
    -d '{
      "org_name":"TestOrg",
      "org_label":"A Test Organization",
      "org_contact_name":"Admin",
      "org_email":"admin@test.org",
      "org_url":"https://test.org",
      "external_admin_group":["myAdminGroup"],
      "external_member_group":["myMemberGroup"],
      "external_executor_group":["'$myExecutorGroup1'", "'$myExecutorGroup2'"],
      "external_id":"myExternalId"
      }'
</pre>
</div>

### Removing the organization executor role from a user account

To remove the org executor role from a user account, simply remove that user from the associated group specified in the `external_executor_group` array. To achieve the same result for multiple users at once, you can remove an entire group from the `external_executor_group` array and run the same command as above.
