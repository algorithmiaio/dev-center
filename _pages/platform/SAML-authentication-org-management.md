---
layout: article
title:  "SAML Authentication and Organization Management"
excerpt: ""
categories: basics
nav_index: 40
show_related: true
image:
teaser: /icons/algo.svg
permalink: /platform/saml-authentication/
redirect_from:
-  /basics/saml-authentication/
---

Security Assertion Markup Language (SAML) is an open standard that allows an identity provider (IdP) to pass authorization credentials to a service provider (SP).

SAML authentication allows a user to use SAML assertions in order to authenticate to the platform. If configured, permission tags can be extracted from the SAML assertion and can be used to facilitate external management of organization membership and user security roles.

This feature is available to [Algorithmia Enterprise](/enterprise) users who have configured SAML and external organization management functionality only.
{: .notice-enterprise}

#### Use cases
-  Allowing user authentication through SAML
-  Using an external management platform for user permission (admin/sudo)
-  Using an external management platform for granting/revoking organization membership/administration privileges
-  Creating local users that represent validated users verified through SAML
-  If the system is configured to accept these tags for SAML authentication and an attribute with the configured name is not included in your assertion, an error will be thrown. If an empty array is provided for this attribute then all permissions will be removed.

#### Authenticating with SAML

To enact a service provider-based authentication please click on the "sign in with SAML" button on the login page. You will either be authenticated automatically or redirected to your identity provider to confirm your credentials.

![SAML login button](/developers/images/post_images/saml/saml-login-button.png)

## Creating a non-existing user

If a valid SAML assertion is used and properly verified, the `nameId` or configured identifier field will be matched to an existing user's `external_id`. If no user with such an `external_id` exists, one will be created, and the `external_id` and `username` of the created user will _both_ match the value found in the `nameID` or configured identity field in the assertion. If an `email` field is supplied under the configured key this will be filled in for the new user as well.

## Changing a user's platform permissions

If the permission tags found in a user's assertion with the tag "memberTag1" are included in the configured attributes value array and match those that have been configured for platform and cluster admin access, then a user will be automatically upgraded to the given role.

## Changing a user's organization roles/membership

### Adding organization management tags to organization objects

When creating or updating an organization, you can provide a list of “tags” which are used in the configured SAML assertion attribute to signify which organizations the user is a member or admin of. Upon authentication with the SAML assertion, the system will automatically synchronize the user with the groups that share these tags. They can be comma delimited as shown below.

![Example of creating organization with permission tags](/developers/images/post_images/jwt-sync/create_org_perm_tags.png)

If a user shares a tag that is held in “External Admin Group” then they will become an admin of this group. If they share a tag that is held in “External Member Group” then they will become a member of this group. If they hold both they will be marked as an admin of this group.

### Assertion content

If the permission tags found in a user's SAML assertion match those that have been configured for a given organization, then a user will be automatically added to the organization with the given role. For instance, if an assertion with the tag "memberTag1" is included in the configured attributes value array, and the organization is configured to add members based off of the "memberTag1" tag, then that user will be made a member.
