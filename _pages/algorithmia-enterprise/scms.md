---
layout: article
title:  "SCMs"
excerpt: "Configuring where users may store algorithm source code"
categories: algorithmia-enterprise
show_related: false
author: rmiller
image:
  teaser: /icons/algo.svg
---

This feature is available to [Algorithmia Enterprise](/enterprise) users only.
{: .notice-enterprise}

Every algorithm on the Algorithmia platform stores its source code within a [Git](https://git-scm.com/) repository. As an Algorithmia administrator, you can configure where algorithm source code repositories reside. We currently support two repository hosts, which we term source control managers (or SCMs): 

- __Algorithmia__: Users may choose to host their algorithm source within the Algorithmia platform itself. This is the default SCM for all new Algorithmia instances.
- __GitHub__:  If configured, you may also allow users to host algorithm source code within a Github instance, be it public Github (e.g. [https://github.com](https://github.com)) or a Github Enterprise instance.

In what follows, we’ll discuss how you can manage which SCMs are available to the users of your Algorithmia instance.

### Viewing SCM Configurations

To view which SCMs have been configured for your Algorithmia instance, navigate to the _Source Control Management_ admin page, which can be found under the “System Actions” section:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/admin_scms/browse_scms.png" alt="Browse SCMs" class="screenshot img-sm">

### Creating a GitHub SCM

Creating and enabling a GitHub SCM will allow your users to host their algorithm source code in Github, and will keep any changes made to those repositories synced with the relevant algorithm. Both Github and GitHub Enterprise are supported.

It is important to note that, at this time, you may not import existing Github repositories: all algorithms will be created with fresh repositories, the names and owners of which are configurable.
{: .notice-info}

When we create a repository for an algorithm, Algorithmia grants itself the following authorizations for the repository specifically:

- The ability to read (but not write) any source code committed to this repository.
- The ability to receive webhook events whenever the repository is moved or renamed.
- The ability to receive webhook events whenever new commits are added to the repository.

These permissions are distinct from those of the creating user–this ensures that, if that individual should leave your organization, Algorithmia will be able to continue to build new versions of the algorithm they created.

#### Create a Github OAuth App

The first step in configuring a Github SCM is creating an OAuth application. An OAuth application allows individual Github users to authorize Algorithmia to act on their behalf. We securely store any authorization obtained, and only use it when necessary (such as when creating a new Github repository for an algorithm).

Please follow [these instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) to set up an OAuth application. When prompted to supply the “Authorization Callback URL”, simply provide the URL to your Algorithmia instance. For example, if your instance is accessible at `https://algorithmia.example.com`, that is the value you would enter in that field.

Once your OAuth application has been created, take down the following information, as they will be necessary in the following step:

- OAuth Application’s Client Id
- OAuth Application’s Client Secret (Keep this confidential at all times)
- GitHub URL (https://github.com for public GitHub, or a custom URL for GitHub Enterprise)

#### Create an SCM

With your Github OAuth application created, it’s time to return to your Algorithmia instance.

If you’ve never created an SCM prior, you’ll only see a single SCM present once you navigate to the page: the “Algorithmia” SCM. Click “Add New” in the upper-right hand corner, and ensure “Github” is selected in the “Provider” field within the form that appears:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/admin_scms/configure_new_scm.png" alt="Configure a new SCM" class="screenshot img-sm">

All fields are required, and using the following reference to determine the appropriate values for the GitHub instance you are attempting to configure:

__Website URL__: This is the URL to your GitHub instance, as noted earlier. For example, if you’re configuring a GitHub Enterprise instance that your users access at https://example.com, you would input https://example.com into this field. If you wish to use public GitHub, enter https://github.com. 

__API URL__: This is the URL for your GitHub instance’s API. Be advised that these differ between public GitHub and GitHub Enterprise. For public GitHub, this value should be https://api.github.com. If you are configuring a GitHub Enterprise instance, this value should be your website URL plus /api/v3. Thus, for a GitHub Enterprise instance configured at https://example.com, the API URL would be https://example.com/api/v3.

__SSH URL__: This is the URL by which we will attempt to pull source code from your GitHub Instance. For public GitHub, this value should be ssh://git@github.com. For GitHub Enterprise instances, replace the domain name with the domain for your instance. For example, if your GitHub Enterprise instance lives at https://example.com, you should enter ssh://git@example.com. 

__OAuth Client ID__: This is the value of the “Client ID” you received during the “Create a Github OAuth App” step. 

__OAuth Client Secret__: This is the value of the “Client Secret” you received during the “Create a Github OAuth App” step. 

Once you’re satisfied with your GitHub SCM’s configuration, click “Connect SCM”. After a brief moment, you should receive a message informing you that your SCM was created successfully.

#### Creating Algorithms with Github

You can read more about creating algorithms with Github in our [user documentation](/developers/algorithm-development/source-code-management).

### Managing SCMs

Both Algorithmia and Github SCMs can be enabled and disabled to your liking, ensuring that your users leverage the correct SCM. Additionally, you can select a “default” SCM for your Algorithmia instance, in the case that you wish to have multiple SCMs enabled at once.

#### Disabling an SCM

By default, all new SCMs are enabled for use in your cluster. You can easily change this by navigating to the admin source control management page, clicking on the SCM you wish to disable, and clicking “Disable”:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/admin_scms/enable_scm.png" alt="Enable an SCM" class="screenshot img-sm">

This will not result in breakage or removal of any algorithms created with that SCM. Disabling an SCM solely prevents new algorithms from being created that leverage the particular SCM.

#### Enabling an SCM

If you wish to enable an SCM, simply navigate to the admin source control management page, select the SCM you wish to enable, and click “Enable”.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/admin_scms/disable_scm.png" alt="Disable an SCM" class="screenshot img-sm">

The SCM will now be available for use by all users within your Algorithmia instance.

#### Selecting a Default SCM

If you have multiple enabled SCMs, you may wish to guide your users to a specific SCM, such as Github. You can do this by selecting an enabled SCM and clicking the “Make Default” button. Once made default, your selected SCM will be the first SCM selected whenever a user attempts to create an algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/admin_scms/make_scm_default.png" alt="Set an SCM as default" class="screenshot img-sm">

### Deleting SCMs

In the case that you’ve created an SCM you no longer wish to use, and which has not been used to create any algorithms, you may remove the SCM from your system entirely. Note that the “internal” SCM cannot be deleted, as it forms a core part of our application.

To delete an SCM, simply navigate to the admin source control management page, select the SCM you wish to delete, and click “Delete”. If an algorithm has been created that leverages the SCM, you will receive an error, and the next best course of action is to disable the SCM, which will hide it from view but allow prior-created algorithms to keep functioning.

### FAQ

__What versions of GitHub Enterprise do you support?__

We offer official support for Github Enterprise 2.19.
