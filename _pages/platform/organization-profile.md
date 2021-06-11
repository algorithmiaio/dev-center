---
categories: basics
excerpt: "Understanding organizations on Algorithmia"
image:
    teaser: /icons/algo.svg
layout: article
nav_index: 25
permalink: /platform/organization-profile/
redirect_from:
  - /basics/organization_profiles/
  - /platform/organizations/
show_related: true
tags: [basics]
title: "Organizations"
---

If you're looking to share algorithms privately or publish algorithms on behalf of an organization, such as a university, private company, or open-source community, then you should consider using our organizations feature.

#### Use cases

* Increase security with shared API keys within an organization
* Avoid individual account ownership of algorithms
* Separate and organize multiple teams or departments within a company using organizations
* Increase governance over who has access to algorithms by adding or deleting members of organizations
* Share resources such as data and algorithms between organization members
* Allow for multiple contributors to algorithms

The following sections cover the basics of using organizations on the Algorithmia platform, including how to create and invite users to an organization, how to approve published algorithms, and how to check your organization's earnings if you charge organization members to call your algorithms.

## Profile page contents

The profile overview provides a rich source of information about an organization. In the overview, you can find the name of an organization, its members, and a list of the algorithms under its ownershipt. If you're an administrator for the organization, you'll also be able to invite and delete members, as well as edit basic information about the organization.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/organization_profile.png" alt="Organizations profile" class="screenshot img-md">

### Things to know about organizations

* Publishing algorithms under an organization requires approval from the organization admin before they are made available to other users on the cluster.
* All earnings from algorithms owned by an organization are rolled up into the organization's account.
* You must be invited into an organization by an organization administrator.

To learn more about organizations, see [how to use organizations](https://training.algorithmia.com/using-organizations).

### Creating an organization

To create a new organization from within Algorithmia's browser UI, click the **Create New** button in the upper-right corner and select **Organization**. You can also create a new organization by clicking the **+** icon on the left and selecting **Organization**.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/new_organization.png" alt="create organization" class="screenshot img-sm">

For specifics on how to fill out the form, see [how to create an organization](https://training.algorithmia.com/using-organizations/708000).

Once your organization has been created you can edit all the provided information as well as add a logo and a Terms of Use document.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/edit_organization.png" alt="Organization info" class="screenshot img-sm">

**Note**: The Terms of Use are organization specific. When users accept an invite to your organization, they'll be accepting the uploaded Terms of Use. Algorithmia records the date when the terms were accepted. These terms are completely independently from Algorithmia's Terms of Use.

### Inviting users to an organization

You can invite users to your organization by clicking the **Invite Member** button at the upper-right corner of the organization profile. You can invite members either by using their Algorithmia account name or by providing their email address. Users invited by account name will receive an email and as well as an in-platform notification to join the organization.

If you invite a user that already has an account, then you must invite them using their account name, not their email. Otherwise, they'll receive an email invite to sign up for the platform and join your organization, even though they already have an account.
{: .notice-warning }

As an organization owner, you can view any pending invitations by clicking on the **Invitations** tab.

To learn more about how to grow and manage organization membership, see [how to manage your organization](https://training.algorithmia.com/using-organizations/707999).

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/organization_invite_user.png" alt="Inviting Users" class="screenshot">

### Viewing organization-level resource usage

If you're an organization administrator, you'll be able to see a **Reporting** tab on your organization's profile, which provides functionality for viewing usage of cloud resources by your organization's members and algorithms. To learn about how to use this feature, see the [advanced governance reporting]({{site.baseurl}}/platform/advanced-governance-reporting/) docs.

### Approving algorithms as an organization administrator

Once members of your organization have created an algorithm and submitted it for approval, a purple indicator with the version to be published will show on your organization profile under algorithms.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/organization_approve_algo.png" alt="Approving Algorithms" class="screenshot img-sm">

**Note:** Every new version of the algorithm to be published will require independent approval.

At this time you'll be able to set the royalty (if any) if you're using our non-Enterprise platform, and finalize publishing.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/organization_approve_algo_royalty.png" alt="Set royalty for team algorithms" class="screenshot">

### Checking earnings

If you're using our non-Enterprise platform, to view your organization's earnings and a break down of all algorithms that are called, click on **View Earnings** on your organization's profile.

<img src="{{site.cdnurl}}{{site.baseurl}}/images/post_images/organizations/organization_earnings.png" alt="Check earnings" class="screenshot img-md">
