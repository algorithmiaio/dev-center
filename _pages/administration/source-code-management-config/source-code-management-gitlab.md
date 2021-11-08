---
categories: admin-panel
layout: article
title: Create a GitLab Configuration
---

This page contains instructions for creating a GitLab configuration so that users will have the option to select GitLab as the source code repository host for new algorithms they create.

## GitLab setup

1.  Log in to GitLab.
2.  Click on the user avatar in the upper-right corner and select **Preferences**.
3.  Select **Applications** from the options at left.
4.  Enter a unique **name** (e.g., "Algorithmia") to identify the application.
5.  Enter a valid **redirect URI**. The format of this is `https://CLUSTER_DOMAIN/v1/scms/oauth/finish`, where `CLUSTER_DOMAIN` is the domain name of your Algorithmia cluster (e.g., `algorithmia.com`).
6.  Check the following boxes as shown below, to grant Algorithmia the necessary permissions to create and manage GitLab repositories for algorithm source code:

    *   api
    *   read_user
    *   read_api
    *   read_repository
    *   write_repository
7.  Click **Save application** at the bottom.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620851257014.png)

Once created, click on the name of the new application in the list that appears at the bottom.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620852145461.png)

The resulting page for the new application displays the configuration information that you specified above. If you need to modify this information, click the **Edit** (pencil icon) button.

You'll need the **application ID** and **secret** values <span style="font-family: inherit; font-size: 1em;">displayed here for the next step when you create the SCM configuration within Algorithmia.</span>

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620852231460.png)

## Algorithmia setup

Once you've created an application in GitLab as described above, log in to Algorithmia as a cluster admin and navigate to the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page from the admin panel. Click **Add SCM Configuration** and select GitLab from the drop-down.

Enter the base website, API, and SSH endpoint URLs. The pre-filled values that appear are just placeholders, so you must actually enter the paths in each field even if you just want the defaults.

The **Website URL** is the URL of your GitLab instance, which is `https://gitlab.com` for the public domain.

The **API URL** is the URL for your GitLab instance's API, which is `https://gitlab.com` for the public domain.

The **SSH URL** is the URL from which we'll attempt to pull source code from your GitLab Instance, which is `ssh://git@gitlab.com` for the public domain. For private GitLab servers, you may need to configure a specific port for SSH access; see [Troubleshooting SSH Connections](https://docs.gitlab.com/ee/ssh/#troubleshooting-ssh-connections) for more details.

Under the **OAuth information** section, enter the **application ID** and **secret** from the GitLab application configuration above and click **Create SCM Configuration**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621526819361.png)

Once you've created the configuration, it'll show up in the list of SCM configurations on the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page.