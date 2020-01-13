---
layout: article
title:  "Source Code Management"
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
When you create an algorithm, a [Git](https://git-scm.com/) repository is initialized to store its source code. Algorithmia currently supports hosting that repository in one of two places: within the Algorithmia platform itself, or on GitHub. In this guide we'll discuss:

- [Choosing a Repository Host](#choosing-a-repository-host)
- [Hosting Source Code on Algorithmia](#hosting-source-code-on-algorithmia)
- [Hosting Source Code on GitHub](#hosting-source-code-on-github)

{% if site.enterprise %}
**Enterprise Users:** By default, new Algorithmia instances can only store source code internally within the Algorithmia platform. Please consult your instance administrator to have GitHub enabled.
{: .notice-info}
{% endif %}

### Choosing a Repository Host

Before we dive into the repository hosts Algorithmia supports, let's discuss the various use cases that fit to each one.

If you're just getting started with Algorithmia, or you want to leverage Algorithmia's [built-in web IDE](#editing-your-algorithm-source-in-the-algorithmia-web-app), you should use Algorithmia as your repository host. This is the simplest way to get started with the platform, but offers limitations when it comes to collaborating with your teammates.

If you want to easily share source code with your colleagues, and support best practices like code reviews, we recommend the GitHub repository host. This does mean that our web-based IDE won't be available for use, but will allow you to more flexibly manage access to your source code and integrate with existing GitHub workflows you may use.

**Algorithm Migration** At this time migrating algorithms between repository hosts is not supported. In order to achieve this, you will need to create a new algorithm and manually move source code between the two algorithm repositories. 
{: .notice-info}

### Hosting Source Code On Algorithmia

Hosting your algorithm's source code within the Algorithmia platform is simple, and no special configuration is required. When creating your Algorithm, simply ensure you select "Algorithmia" within the source code configuration section:

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/create_algorithm_algorithmia_scm.png" alt="Creating an algorithm with the Algorithmia repository host" class="screenshot img-sm">

The "Source Visibility" setting determines whether the source code for your algorithm will be viewable by other Algorithmia users. Select "Restricted" if you only wish algorithm owners to have access to the algorithm's source.

#### Editing Your Algorithm Source Locally

When your algorithm is created, we'll generate a unique HTTPS URL you can use to clone your algorithm's Git repository:

{% highlight bash %}
git clone https://git.algorithmia.com/git/username/algoname.git
{% endhighlight %}

Replace the `username` and `algoname` values as appropriate. If you're working with an organization-owned algorithm, then `username` should be replaced with the name of the organization. 

Provide your Algorithmia username and password when asked to authenticate.

{% if site.enterprise %}
**OIDC Users** If your Algorithmia instance is configured to use OIDC, you will not have a password. To obtain a password, navigate to your user settings page and click "Regenerate Account Password". By following the instructions, you will be provided a password you can use to authenticate with your Algorithmia-hosted Git repositories.
{: .notice-info}
{% endif %}

Once you've made changes, commit them to your repository's `master` branch 

{% highlight bash %}
git add your_file_to_commit
git commit -m "Message about commit changes"
{% endhighlight %}

Then, push your changes to Algorithmia. This will commence a new build of your algorithm.

{% highlight bash %}
git push origin master
{% endhighlight %}

Algorithmia will only compile the head of the master branch on each push. Additionally, it will not compile intermediate commits if they are all pushed together as a batch. 

Attempts to rewrite the history of an algorithm's source repository will be rejected, as doing so could potentially break prior versions of the algorithm.

Algorithmia does not currently support SSH as a means of cloning algorithm repositories
{: .notice-info}

#### Editing Your Algorithm Source in the Algorithmia Web App

Algorithms which host their source within Algorithmia can be edited directly from our web app. As an algorithm owner, simply click on the "Source Code" tab within an algorithm page to get started.

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/algorithm_source_code_tab.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

Once you've entered the Web IDE, you have the ability to create, edit, and delete files for your algorithm.

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/algorithm_web_ide.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

Once you're satisfied with your changes, click the "Build" button to test your changes in the terminal, or "Publish" to create a new version of your algorithm.

### Hosting Source Code on GitHub

By hosting your algorithm's source code on GitHub, you can take advantage of GitHub's rich set of developer features, such as pull requests and GitHub Actions, and also ensure that access to your source code is carefully mediated.

If you're new to Git, we recommend [this tutorial series](https://try.github.io/) by GitHub.

**Web IDE Support** At this time we do not support editing source code in our web app for GitHub-hosted algorithms. 
{: .notice-info}

#### Connecting Your Algorithmia & GitHub Accounts

To connect your Algorithmia and GitHub accounts, simply select the GitHub instance you wish to use when creating your algorithm:

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/scm_create_github_algorithm_unauthorized.png" alt="Authorization prompt for GitHub repository host" class="screenshot img-sm">

If you haven't yet connected your GitHub account, you will be prompted to do so. By connecting your GitHub account, you will give us access to create repositories on your behalf, which will house your algorithm's source code.

#### Creating Algorithms with GitHub

Once you've connected your GitHub account to Algorithmia, you will be able to host algorithm source code in GitHub.

You can customize two aspects of the GitHub repositories that are created for your algorithms: the repository's owner, and its name.

By default, all GitHub respositories are created under your personal GitHub account. However, you may optionally choose any GitHub organizations that you are a member of. These organizations are listed in the "Repository Owner" dropdown:

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/scm_create_github_algorithm_org.png" alt="Customizing your repository owner" class="screenshot img-sm">

You may also customize the name of the repository that is created. By default the name of your algorithm is used. 

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/scm_create_github_algorithm_name.png" alt="Customizing your repository name" class="screenshot img-sm">

If you decide to use an alternative name, we recommend that you use only letters, numbers, hyphens, and/or underscores. While GitHub will accept characters outside this range, they will replace any unsupported characters with an underscore, resulting in an undesirable repository name.

When we create your repository, we associate the following with it:

- **A Deploy Key**: [GitHub deploy keys](https://github.blog/2015-06-16-read-only-deploy-keys/) allow read-only access to specific repositories, and are GitHub’s prescribed means by which external services can fetch code for building and deploying. These keys are not tied to individual permissions, and as such will allow Algorithmia to continue building an algorithm even if the permissions of the creating user change. We also use deploy keys to obtain your repository's commit log (to display changes when publishing versions) and README.md (for use as algorithm documentation).
- **Webhooks**: We set up webhooks to receive notifications about changes to your repo, such as when there's a change to its default branch.

#### Updating GitHub-Hosted Algorithms

Once you've created your algorithm, any commits to your GitHub repository's _default_ branch will result in a build on Algorithmia. At creation, your repository's default branch will be your `master` branch, but you can change this at any time in your repository's settings.

You can view your algorithm's builds by heading to it's landing page and clicking the "Builds" tab if you are the algorithm's owner.

#### Deleting GitHub-Hosted Algorithms

If you wish to delete an algorithm that hosts its source code in GitHub, have no fear: the repository will be left unharmed. If you do wish to destroy your algorithm's source code, you can follow [these instructions](https://help.github.com/en/github/administering-a-repository/deleting-a-repository).

#### Managing Your GitHub Authorization

If you want to review your GitHub authorization status, you can visit your user settings page. Simply scroll to the "Source Control Management" section to view any prior GitHub authorizations, or to connect your account:

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/scm_user_settings.png" alt="User source code management settings" class="screenshot img-sm">

{% if site.enterprise %}
**Enterprise Users:** By default, new Algorithmia instances can only store source code internally within the Algorithmia platform. As such, you may not see GitHub listed within the above section until your administrator enables GitHub as a source host.
{: .notice-info}
{% endif %}

#### Troubleshooting GitHub-Hosted Algorithms

With the source for your algorithm hosted externally, there is a chance that our connection to GitHub could become disrupted. When this happens, it could be due to one of the following:

##### Your Repository's Deploy Key Was Removed

We depend on [deploy keys](https://github.blog/2015-06-16-read-only-deploy-keys/) to pull source code from your algorithm for building. A deploy key is simply an SSH keypair with read-only access to a specific repository. Algorithmia securely stores the private key while the public key is shared with GitHub.

You can obtain the public key for your repository by navigating to your algorithm's settings page and clicking "View Key":

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/algorithm_settings_select_deploy_key.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

You will then be presented with a modal, from which you can copy the public key.

<img src="{{site.cdnurl}}{{site.baseurl}}/developers/images/post_images/source_code_management/algorithm_settings_view_deploy_key.png" alt="Algorithm Page Source Code Tab" class="screenshot img-sm">

With the deploy key in hand, simply follow [instructions outlined here](https://developer.github.com/v3/guides/managing-deploy-keys/#deploy-keys) to restore the public key to your repository.

##### Your Repository Was Deleted

If your algorithm's GitHub repository was deleted, you may attempt to [restore the relevant repository](https://help.github.com/en/github/administering-a-repository/restoring-a-deleted-repository). It is essential that both the repository's deploy key and webhooks remain in place after restoration, otherwise we will not be able to pull your source code, or know when you make changes.

#### FAQ

__I'd like to reuse an existing GitHub repository for my algorithm. Is this possible?__

At this time we are only able to use new, purpose-created repositories for GitHub-backed algorithms, which Algorithmia itself creates and provisions.

__Can I rename or move the GitHub repository that backs my algorithm?__

Yes! Upon any change to your repository's name or owner we receive a webhook which we will use to update our system to point to the new repository address.

__I’m a member of a GitHub organization, but I don’t see that organization listed as a possible owner when creating an algorithm. What’s wrong?__

An administrator of your GitHub organization likely needs to approve the OAuth application that’s being used to authorize Algorithmia users. You can request approval by following the instructions in [this GitHub documentation](https://help.github.com/en/github/setting-up-and-managing-your-github-user-account/requesting-organization-approval-for-oauth-apps#:~:targetText=Click%20the%20Authorized%20OAuth%20Apps,click%20Request%20approval%20from%20owners.).

__I revoked access to the Algorithmia's Github OAuth application, and now none of the repositories I created can build!__

When you revoke access to an OAuth app, Github automatically revokes both your token and any deploy keys you may have created via the OAuth app. To fix your algorithms, simply [follow the instructions above](#your-repositorys-deploy-key-was-removed) on restoring deploy keys to a repository.
