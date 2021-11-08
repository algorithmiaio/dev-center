---
categories: scm
layout: article
title: Create a Bitbucket Server (build-on-checkin) Configuration
---

This page contains instructions for creating a Bitbucket Server configuration so that users will have the option to select Bitbucket Server as the source code repository host for new algorithms they create.

Note that there are two types of Bitbucket Server providers you can use. With this "build-on-checkin via webhook" provider type, when algorithm source code is pushed to the repository's master branch, the build is triggered automatically. To see what this workflow looks like on the side of the algorithm developer, see the [Bitbucket Server SCM docs](https://algorithmia.com/developers/algorithm-development/source-code-management#hosting-source-code-on-bitbucket-server) on our Developer Center. See the [Bitbucket Server (build-via-API)](./843874) page for details on how to set up a configuration with the other provider type.

## Bitbucket Server setup

To create a Bitbucket Server SCM configuration on Algorithmia, you'll first need to configure a project on the Bitbucket Server side, as described in this section.

### Prerequisites

1.  Bitbucket Server version >= 5.6 is required.
2.  Bitbucket Server must be set up with a valid SSL certificate.

### Configuring server access

1.  Log in to Bitbucket Server as an administrator and open the admin dashboard.
2.  Open the **Server settings** tab.
3.  Enter the base URL for the Bitbucket Server instance, including the `https://` part in the string.
    ![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620743991129.png)
4.  Enable HTTPS and SSH access by checking the appropriate boxes. We recommend configuring SSH on a different port than the web interface. ![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620743119246.png)

### Configuring access token authentication

Once you've completed the steps above, create an access token that'll be used by Algorithmia to manage repositories on behalf of a user.

1.  Log in as a non-admin user.
2.  Click on the profile menu in the upper-right corner and click **Manage account**.
3.  Go to the **Personal access tokens** submenu.
4.  Create a new **token** with admin permissions for both projects and repositories.![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620743217406.png)

Note that in practice we only require "read" project permissions and "write" repository permissions. However we've experienced permission errors when using tokens with lesser-than-admin permissions, so to make sure everything works as expected it's best configure the token with admin/admin permissions.

### Creating a new project

Once the server is set up correctly, you can create a new project where all Algorithmia-managed repositories will be hosted.

1.  Open the **Projects** view.
2.  Create a new project for containing new algorithm repositories and note the **project key**.
3.  Open project settings and go to the **Project permissions** tab.
4.  In **User access** select admin access for the user configured in the previous step.

## Algorithmia setup

Once you've created an access token within Bitbucket Server as described above, log in to Algorithmia as a cluster admin and navigate to the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page from the admin panel. Click the **Add SCM Configuration** button and select Bitbucket Server from the drop-down.

Enter the base website, API, and SSH endpoint URLs specific to your Bitbucket Server instance.

The **Website URL** is the URL of your Bitbucket Server instance. Note that each SCM configuration must have a unique (Website URL, project key) pair.

The **API URL** is the URL for your Bitbucket Server instances's API.

The **SSH URL** is the URL from which we'll attempt to pull source code from your Bitbucket instance; remember to specify port 8000 at the end of the URL.

Under the **OAuth information** section, enter the values from the token configuration above for **project key** and **personal access token** and click **Create SCM Configuration**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621526272064.png)

Once you've created the configuration, it'll show up in the list of SCM configurations on the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page.