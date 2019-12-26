---
layout: article
title:  "Source Code Managment"
excerpt: "Controlling where the source code for your algorithm resides"
categories: algorithm-development
tags: [algo-dev]
author: rmiller
image:
  teaser: /icons/algo.svg
permalink: /algorithm-development/source-code-management/
redirect_from:
  - /algorithm-development/algorithm-basics/git/
  - /algorithm-development/git-support/
  - /algorithm-development/git/
---
When you create an algorithm, a [Git](https://git-scm.com/) repository is initialized to store its source code. Algorithmia currently supports hosting that repository in one of two places: within the Algorithmia platform itself, or on Github.

**Enterprise Users:** By default, new Algorithmia instances can only store source code internally within the Algorithmia platform. Please consult your instance administrator to have Github enabled.
{: .notice-info}

If you're new to Git, we recommend [this tutorial series](https://try.github.io/) by Github.

### Hosting Source Code On Algorithmia

Hosting your algorithm's source code within the Algorithmia platform is simple, and no special configuration is required. When creating your Algorithm, simply ensure you select "Algorithmia" within the source code configuration section:

**RYAN ADD IMAGE HERE**

The "Source Visibility" setting determines whether the source code for your algorithm will be viewable by other Algorithmia users. Select "Restricted" if you only wish algorithm owners to have access to the algorithm's source.

#### Editing Your Algorithm Source Locally

When your algorithm is created, we'll generate a unique HTTPS URL you can use to clone your algorithm's Git repository:

{% highlight bash %}
git clone https://git.algorithmia.com/git/username/algoname.git
{% endhighlight %}

Replace the `username` and `algoname` values as appropriate. If you're working with an organization-owned algorithm, then `username` should be replaced with the username of the organization. 

Provide your Algorithmia username and password when asked to authenticate.

{% if site.enterprise %}
**OIDC Users** If your Algorithmia instance is configured to use OIDC, you will not have a password. To obtain a password, navigate to your user settings page and click "Regenerate Account Password". By following the instructions, you will be provided a password you can use to authenticate with your Algorithmia-hosted Git repositories.
{: .notice-info}
{% endif %}

Once you've made changes, commit them to your repository's `master` branch 

{% highlight bash %}
git -A your_file_to_commit
git commit -m "Message about commit changes"
{% endhighlight %}

Then, push your changes to Algorithmia. This will commence a new build of your algorithm.

{% highlight bash %}
git push origin master
{% endhighlight %}

Algorithmia will only compile the head of the master branch on each push. Additionally, it will not compile intermediate commits if they are all pushed together as a batch. 

Attempts to rewrite the history of an algorithm's source repository will be rejected, as doing so could potentially break prior versions of the algorithm.

#### Editing Your Algorithm Source in the Algorithmia Web App

Algorithms which host their source within Algorithmia can be edited directly from our web app. As an algorithm owner, simply click on the "Source Code" tab within an algorithm page to get started.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/source_code_management/algorithm_source_code_tab.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

Once you've entered the Web IDE, you have the ability to create, edit, and delete files for your algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/source_code_management/algorithm_web_ide.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

Once you're satisfied with your changes, click the "Build" button to test your changes in the terminal, or "Publish" to create a new version of your algorithm.

### Hosting Algorithm Source Code on Github

By hosting your algorithm's source code on Github, you can take advantage of Github's rich set of developer features, such as pull requests and Github Actions, and also ensure that access to your source code is carefully mediated.

**Important** For management and documentation purposes, we allow users without Github authorization to view a  repository's recent commit messages and README. If this disclosure is not acceptable, we recommend using Algorithmia to host your algorithm source code.
{: .notice-info}

**Web IDE Support** At this time we do not support editing source code in our web app for Github-hosted algorithms. 
{: .notice-info}

#### Connecting Your Algorithmia & Github Accounts

To connect your Algorithmia and Github accounts, simply select the Github instance you wish to use when creating your algorithm:

**RYAN ADD IMAGE**

If you haven't yet connected your Github account, you will be prompted to do so. By connecting your Github account, you will give us access to create repositories on your behalf, which will house your algorithm's source code.

#### Creating Algorithms with Github

Once you've connected your Github account to Algorithmia, you will be able to host algorithm source code in Github.

You can customize two aspects of the Github repositories that are created for your algorithms: the repository's owner, and its name.

By default, all Github respositories are created under your personal Github account. However, you may optionally choose any Github organizations that you are a member of. These organizations are listed in the "Repository Owner" dropdown:

**RYAN ADD IMAGE**

You may also customize the name of the repository that is created. By default the name of your algorithm is used. 

**RYAN ADD IMAGE**

If you decide to use an alternative name, we recommend that you use only letters, numbers, hyphens, and/or underscores. While Github will accept characters outside this range, they will replace any unsupported characters with an underscore, resulting in an undesirable repository name.

When we create your repository, we associate the following with it:

- **A Deploy Key**: [Github deploy keys](https://github.blog/2015-06-16-read-only-deploy-keys/) allow read-only access to specific repositories, and are Github’s prescribed means by which external services can fetch code for building and deploying. These keys are not tied to individual permissions, and as such will allow Algorithmia to continue building an algorithm even if the permissions of the creating user change.
- **Webhooks**: We set up webhooks to receive notifications about changes to your repo, such as a commit to its master branch, or when its name change.

#### Managing Your Github Authorization

If you want to review your Github authorization status, you can visit your user settings page. Simply scroll to the "Source Control Management" section to view any prior Github authorizations, or to connect your account:

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/source_code_management/scm_user_settings.png" alt="User source code management settings" class="screenshot img-sm">

**Enterprise Users:** By default, new Algorithmia instances can only store source code internally within the Algorithmia platform. As such, you may not see Github listed within the above section until your administrator enables Github as a source host.
{: .notice-info}

#### Troubleshooting Github-Hosted Algorithms

With the source for your algorithm hosted externally, there is a chance that our connection to Github could become disrupted. When this happens, it could be due to one of the following:

##### Your Repository's Deploy Key Was Removed

We depend on [deploy keys](https://github.blog/2015-06-16-read-only-deploy-keys/) to pull source code from your algorithm for building. A deploy key is simply an SSH keypair with read-only access to a specific repository. Algorithmia securely stores the private key while the public key is shared with Github.

You can obtain the public key for your repository by navigating to your algorithm's settings page and clicking "View Key":

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/source_code_management/algorithm_settings_select_deploy_key.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

You will then be presented with a modal, from which you can copy the public key.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/source_code_management/algorithm_settings_view_deploy_key.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

With the deploy key in hand, simply follow [instructions outlined here](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) to restore the public key to your repository.

##### Your Repository Was Deleted

If your algorithm's Github repository was deleted, you may attempt to [restore the relevant repository](https://help.github.com/en/github/administering-a-repository/restoring-a-deleted-repository). It is essential that both the repository's deploy key and webhooks remain in place after restoration, otherwise we will not be able to pull your source code, or know when you make changes.
