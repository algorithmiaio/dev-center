---
layout: article
title:  "JWT-JWKS Authentication and Organization Management"
excerpt: ""
categories: basics
nav_index: 40
show_related: true
image:
teaser: /icons/algo.svg
permalink: /platform/jwt-authentication/
redirect_from:
-  /basics/jwt-authentication/
---

JSON Web Tokens (JWTs) are an open, industry standard RFC 7519 method for representing proof of secure communication between two parties.

JWT authentication allows a user to use JWTs that are validated against a JWKS (JSON Web Key Set) URL in order to execute operations on the platform. If configured, permission tags can be extracted from the JWT and used to facilitate external management of organization membership and user security roles.

This feature is available to [Algorithmia Enterprise](/enterprise) users who have configured JWT/JWKS and organization management functionality only.
{: .notice-enterprise}

#### Use cases
-  Allowing user login through JWT
-  Using an external management platform for user permission (admin/sudo)
-  Using an external management platform for granting/revoking organization membership/administration privileges
-  Creating local users that represent validated users verified through JWT

#### Making a call with JWT

JWTs are submitted using standard bearer tokens and will work for any v1 endpoint in the Algorithmia API. An example cURL command for executing an algorithm using a JWT is as follows. In this code, `CLUSTER_DOMAIN` would be replaced by the unique domain name of the Algorithmia cluster, `ORG_NAME` would be the name of the account or organization, `ALGO_NAME` would be the name of the algorithm, and `ALGO_VERSION` would be an optional version hash or semantic version (e.g., `0.1.1`).

```sh
curl https://CLUSTER_DOMAIN/v1/algo/ORG_NAME/ALGO_NAME/ALGO_VERSION \

-X POST \

-H 'Authorization: Bearer eyJhbGciOiJSizI1NiIsImtpZCI6ImltVWduWnZLS0h2MWUyNHkyZldCOXpTNjhIMkdMMzhSbjgzc1ZwQnh5WjAifQ.
eyJhdWQiOiHUE1dOlVSSTpSUy0zMDQzNS0xNzQ5OC1jYmJHcmlkdmlld0ludmVudG9yeS1ERVYiLCJpc3MiOiJodHRwOi8vaWRhZC5qcG1vcmdhbmNoYX
NlLmNvbS9hZGZzL3NlcnZpY2VzL3RydXN0Iiw3eWF0IjoxNjEzNTk4ODYzLCJleHAiOjE2MTM2MDI0NjMsIkpQTUNJZGVudGlmaWVyIjoiUHJhaGFyYWo
iLCJFbXEsb3llZUNvcnBvcmF0ZUlEIjoiUHJhaGFyYWoiLCJDbGllbnRJUEFkZHJlc3MiOiIxNzIuMjguNS4xMzUiLCJhcHB0eXBlIjoiUHVasGljIiwi
YXBwaWQiOiJQQy0zMDQzNS1SNjQ5NjE4LTEwNzg5lDRFViIsImF1dGhtZXRob2QiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3Nlc
zpQYXNzd29yZFByb3RlY3RlZFRyYW5zcG9ydCIsImF1dGhfdGltZSI6IjIwMjAtMDItMjhUMTQ6MDM6NTAuNTUzWiIsInZlciI6IjEuMCIsInN1YiI6Il
ByYWhhcmFqIn0.RLaIHp_LAnMeRWdYyYiHrD_camdLEbONR9R7gv12i1cu01G1FninwjwpnLCmyFpW2PYUIWpvB0qOKUAOSDilt0fHTFSEKxPyJrukGTz
P4fS21W0w8MWHshLhmPL6gPQVhbFMQMhwBDJA-YHd-ah6WN8EE73mYwpp_DTQcIYhcfvoAxZLrY_bEK2XTDFfyqAZjwZzoRBXkGFXIw-PkYvOZ0F6J3oR
ubN1U0mTA6sn0kMo7aItMIKT-AssKv2lkWDUSCQp3Nz3-cMjN4F_IyTnUR-uM6f3tcy-kBjuGB6TAY_decnZmJ-JfVUK3TXKjSmFD80Zpc37tHT-vhdTq
Q9nOA' \

-H 'Content-Type: application/json' \

-d '{"first_name":"Test", "last_name":"User"}'

```
## JWT payload specifics

-  Only RSA256 Encryption is supported.
-  JWKS should be verified by KID, legacy x5t is supported as well but not preferred.
-  Is no username claim is configured the subject claim will resolve to a user's `external_id`.
-  Issuer `iss` and audience `aud` claims must match configurations for your installation.
-  The expiration `exp` claim is honored by our system.
-  Email and group claims can be configured; any other claim is ignored.
-  If permission tags are configured on a system under a given claim for JWT and that claim is not contained in your JWT payload then an error will be thrown. Please note the claim will accept a single string or an array of strings for a single or multiple permission tags, respectively. An empty array will remove all permissions.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)

## Creating a non-existing user

If a valid JWT token is used and properly verified, the configured `username` field will be matched to an existing user's `external_id`. If no user with such an `external_id` exists, one will be created, and the `external_id` and `username` of the created user will match the values found in the token. If an `email` field is supplied under the configured key this will be filled in for the new user as well.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)

## Changing a user's platform permissions

If the permission tags found in a user's token match those that have been configured for cluster admin access, the user will be automatically promoted to the given role. For instance if the below token is supplied, and the cluster is configured to create cluster admins based off of the "superAdmin" tag, then a user will be made a cluster admin.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)

## Changing a user's organization roles/membership

### Adding organization management tags to organization objects

When creating or updating an organization, you can provide a list of “tags” which are used in the configured JWT claim field to signify which organizations the user is a member or admin of. Upon usage of the JWT, the system will automatically synchronize the user with the groups that share these tags. They can be comma delimited as shown below.

![Example of creating organization with permission tags](/developers/images/post_images/jwt-sync/create_org_perm_tags.png)

If a user shares a tag that is held in **External Admin Group**, they will become an admin of this group. If they share a tag that is held in **External Member Group**, they will become a member of this group. If they share both tags, they will be marked as an admin of this group.

### JWT payload

If the permission tags found in a user's token match those that have been configured for a given organization, then the user will be automatically added to the organization with the given role. For instance if the below token is supplied and the organization is configured to add members based off of the "memberTag1" tag, then the user will be made a member.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)
