---
categories: scm
layout: article
title: Create a Bitbucket Cloud Configuration
---

This page contains instructions for creating a Bitbucket Cloud configuration so that users will have the option to select Bitbucket Cloud as the source code repository host for new algorithms they create.

## Bitbucket Cloud setup

1.  Log in to Bitbucket Cloud.
2.  Click on the user icon in the lower-left corner select your workspace.
3.  Select **Settings** and then **OAuth consumers** from the options at left.
4.  Enter a unique **name** <span style="font-family: inherit; font-size: 1em;">(e.g., "Algorithmia") to identify the application.</span>
5.  Enter a valid **callback URL**. The format of this is `https://CLUSTER_DOMAIN`, where `CLUSTER_DOMAIN` is the domain name of your Algorithmia cluster (e.g., `algorithmia.com`).
6.  Check the following boxes as shown below, to grant Algorithmia the necessary permissions to create and manage Bitbucket repositories for algorithm source code:

    *   _Account_: Read
    *   _Repositories_: Write, Admin, Delete
    *   _Webhooks_: Read and write
7.  Click **Save** at the bottom.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620914763845.png)

Click on the name of the new consumer in the list that appears.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620914873230.png)

To edit the consumer configuration, click the ellipses at the right and select **Edit**.

You'll need the **application ID** and **secret** values <span style="font-family: inherit; font-size: 1em;">displayed here in the next step when you complete the SCM provider configuration within Algorithmia.</span>

## Algorithmia setup

Once you've created an OAuth consumer in Bitbucket Cloud as described above, log in to Algorithmia as a cluster admin and navigate to the [Source Code Management](/developers/administration/admin-panel/source-code-management) page from the admin panel. Click **Add SCM Configuration** and select Bitbucket Cloud from the drop-down.

Enter the base website, API, and SSH endpoint URLs. The pre-filled values that appear are just placeholders, so you must actually enter the paths in each field even if you just want the defaults.

The **Website URL** is the URL of your Bitbucket Cloud instance, which is `https://bitbucket.org` for the public domain.

The **API URL** is the URL for your Bitbucket Cloud instance's API, which is `https://api.bitbucket.org` for the public domain.

The **SSH URL** is the URL from which we'll attempt to pull source code from your Bitbucket instance, which is `ssh://git@bitbucket.org`.

Under the **OAuth information** section, enter the values from the consumer configuration above for **consumer key** and **consumer secret** and click **Create SCM Configuration**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621526714884.png)

Once you've created the configuration, it'll show up in the list of SCM configurations on the [Source Code Management](/developers/administration/admin-panel/source-code-management) page.