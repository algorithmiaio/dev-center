# Manage user roles

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

<pre class="code_snippet">$ curl https://**CLUSTER_DOMAIN**/admin/roles/**ACCOUNT_NAME**/cluster_viewer \
    -X POST \
    -H 'Authorization: Simple **ADMIN_API_KEY**'
</pre>

</div>

### Removing the cluster viewer role from a user account

To remove the cluster viewer role so that a user account regains standard user privileges, you can delete the role with the following command. Note that you'll need to substitute `ACCOUNT_NAME` with the name of the account from which to remove the cluster viewer role, and you'll need to supply an admin API key. Also note that `CLUSTER_DOMAIN` does not contain the `api.` component (e.g., just `algorithmia.com` and not `api.algorithmia.com`).

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://**CLUSTER_DOMAIN**/admin/roles/**ACCOUNT_NAME**/cluster_viewer \
    -X DELETE \
    -H 'Authorization: Simple **ADMIN_API_KEY**'
</pre>

</div>

### Using SAML to manage the cluster viewer role

You can also complete the configuration shown above using SAML sync instead of an admin API key. The sync group IDs can be set with the `org_mgmt_cluster_viewer_group_id` installer variable.