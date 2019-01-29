---
layout: article
title:  "Teams and Organizations"
excerpt: "Understanding Teams and Organizations on Algorithmia"
tags: [alg-dev-getting-started, app-dev-getting-started]
show_related: true
image:
    teaser: /icons/algo.svg
---

If you are looking to share algorithms privately or publish algorithms under the moniker of an organization like a university, private company or open source community then Algorithmia’s Teams and Organizations is what you are looking for. The following sections cover the basics of using Teams and Organizations on the Algorithmia platform including how to create and invite users to an organization, how to approve published algorithms and how to check your organization's earnings.


#### The Profile Overview:

The profile overview provides a rich source of information about the organization. In the overview, you can find the name of the organization, the number of members, the number of algorithms, and the aggregate amount of API requests received. If you are the owner of the organization you will also be able to Add/Delete members as well as Edit basic information regarding the organization.

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_profile.png" alt="organizations profile" class="screenshot img-md">


#### Things to know about Organizations:
* Publishing algorithms under an organization requires approval from the organization owner before they are made available to other users in the marketplace.
* All earnings from algorithms under an organization are rolled up into the organization's account.
* You must be invited into an organization by the organization owner or administrator.




#### Creating an Organization:

To create your new organization simply go to your profile page and click "+Create Organization"


<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/new_organization.png" alt="create organization" class="screenshot">

At this time you will be asked to fill out some information regarding your organization:

* *Organization Account Name:*
This will determine the URL where your organization will be showcased. It is required that this be all lowercase letters, no spaces and no special characters.
* *Organization Full Name:* This is the organization's full name.
* *Contact Name:* The primary contact for your organization.
* *Organization Email:* The organization's primary email.
* *Url:* Your organization's website.


<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_info.png" alt="Organization info" class="screenshot img-sm">

Once your organization has been created you can edit all the provided information as well as add a logo and a Terms of Use document.

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_edit_info.png" alt="Organization info" class="screenshot img-sm">

**Note**: The Terms of Use are organization specific. When users accept an invite to your organization they will be accepting the Terms of Use uploaded. Algorithmia records the date when the terms where accepted. These terms are completely independent of the Algorthmia Terms of Use.



#### Inviting Users to your Organization:
You can invite users to your organization either by using their Algorithmia username or by providing an email address. If you invite a user through email that is not part of the Algorithmia platform, they will receive an email invite to signup and join your organization.

To invite a user simply click 'Invite User':

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_invite_user.png" alt="Inviting Users" class="screenshot">

After clicking 'Invite User' a form will appear and you can enter the users name or email address:

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_invite_form.png" alt="Inviting Users" class="screenshot img-sm">

#### Approving Algorithms:
Once members of your organization have created an algorithm and submitted it for approval, a purple indicator with the version to be published will show on your organization profile under algorithms.

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_approve_algo.png" alt="Approving Algorithms" class="screenshot img-sm">

**Note:** Every new version of the algorithm to be published will require independent approval.

At this time you will be able to set the royalty (if any) for that algorithm and finalize publishing to Algorithmia's marketplace.

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_approve_set_royalty.png" alt="Set royalty for team algorithms" class="screenshot">

#### Check Earnings:
To view your organization's earnings and a break down of all algorithms that are called, simply access "View Earnings" on your organization's profile.

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/org_earnings.png" alt="Check earnings" class="screenshot img-md">



{% if site.enterprise %}
#### Enterprise Users Only: the User and Org Management APIs

Algorithmia also provides APIs for listing, creating, and managing users and organizations.

For the full specification, see the [User and Org Management APIs](https://documenter.getpostman.com/view/6515899/Rztiuqf9) or the "users" and "organizations" sections of the official [OpenAPI Spec](https://algorithmia.com/v1/openapispec)

Note that there are two different types of API Keys, used with different endpoints.  All Algorithm Management APIs use Management Keys, which can be created at the bottom of {{site.url}}/user#credentials.  Ensure that the Key you are using has the checkbox "Allow this key to manage my algorithms" checked:

<img src="{{ site.cdnurl }}{{ site.baseurl }}/images/post_images/organizations/management-keys.png" alt="Api Keys, Manage My Algorithms" class="screenshot">
{% endif %}
