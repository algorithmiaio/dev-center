---
categories: admin-panel
layout: article
title: Create a GitHub Configuration
---

This page contains instructions for creating a GitHub configuration so that users will have the option to select GitHub as the source code repository host for new algorithms they create.

## GitHub setup

Note that when you follow the steps below on GitHub, you must be a GitHub organization **owner** (and not just a **member**) in order for the SCM configuration to be available for Algorithmia cluster users as a source code repository host. That is, the below steps will work to create an SCM configuration as a GitHub organization **member**, but the resulting configuration won't be displayed in the **repository owner** drop-down when Algorithmia cluster users go to create a new algorithm.

1.  Log in to GitHub.
2.  Click on the user avatar in the upper-right corner and select **Settings**.
3.  Select **Developer settings** and then **OAuth Apps** from the options at left.
4.  If you already have OAuth applications in your account, click the **New OAuth App** button on the right.
5.  Enter a unique **name** (e.g., "Algorithmia") to identify the application to users.
6.  Enter the your application homepage's URL in the **homepage** **URL** box.
7.  Optionally enter an **application description** to identify the purpose of the application.  
8.  Enter an **authorization callback URL**. The format of this is `https://CLUSTER_DOMAIN`, where `CLUSTER_DOMAIN` is the domain name of your Algorithmia cluster (e.g., `algorithmia.com`).
9.  Click **Register application** at the bottom.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620867268774.png)

The resulting page for the new application displays the configuration information that you specified above. If you need to modify this information, make any desired changes and click **Update application**.

Click the **Generate a new client secret** button and store the **client secret** value temporarily in a safe place, or leave the tab open. You'll need the **client secret** and **client ID** values <span style="font-family: inherit; font-size: 1em;">displayed here in the next step when you complete the SCM provider configuration within Algorithmia.</span>

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1620865506829.png)

## Algorithmia setup

Once you've created an OAuth application in GitHub as described above, log in to Algorithmia as a cluster admin and navigate to the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page from the admin panel. Click **Add SCM Configuration** and select GitHub from the drop-down.

Enter the base website, API, and SSH endpoint URLs, as described below. The pre-filled values that appear are just placeholders, so you must actually enter the paths in each field even if you just want the defaults.

The **Website URL** is the URL of your GitHub instance, which is `https://github.com` for the public domain. If you're creating a configuration to a GitHub Enterprise instance that users access at `https://example.com`, enter that URL into this field.

The **API URL** is the URL for your GitHub instance's API, which is `https://api.github.com` for the public domain. If you're configuring a GitHub Enterprise instance, this value is your website's URL plus `/api/v3`. For example, for a GitHub Enterprise instance configured at `https://example.com`, the API URL is `https://example.com/api/v3`.

The **SSH URL** is the URL by which we'll attempt to pull source code from your GitHub instance, which is `ssh://git@github.com` for the public domain. For GitHub Enterprise instances, replace the public domain name with the domain of your instance. For example, if your GitHub Enterprise instance lives at `https://example.com`, enter `ssh://git@example.com`.

Under the **OAuth information** section, enter the **client ID** and **client secret** from the application configuration above and click **Create SCM Configuration**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1621526891651.png)

Once you've created the configuration, it'll show up in the list of SCM configurations on the [Source Code Management](/exploring-the-admin-panel/687291#managing-scm-provider-options) page.