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
- /basics/jwt-authentication/
---

JWT authentication allows a user to use JWT tokens which are validated against a JWKS URL in order to execute 
operations on the platform. If configured permission tags can be extracted from the JWT token and can be used to 
facilitate external management of organization membership and user security roles.

This feature is available to [Algorithmia Enterprise](/enterprise) users who have configured JWT/JWKS and organization management functionality only.
{: .notice-enterprise}

#### Use cases
- Allowing user login through JWT
- Using an external management platform for user permission(admin/sudo)
- Using an external management platform for granting/revoking organization membership/administration privileges
- Creating local users that represent validated users verified through JWT

#### Making a call with JWT:


JWT tokens are submitted using standard bearer tokens, an example curl command for executing an algorithm using JWT is as follows, JWT will work for any v1 endpoint:

```
curl https://algorithmiaTestServerExample/v1/algo/myGroupName/myAlgorithmName/0.1.1 \

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




## Creating a non existing user

If a valid JWT token is used and properly verified the configured username field will be matched to an existing users external_id. If no user with such an external_id exists one will be created, 
the external_id and username of the user will match the value found in the token, if an email field is supplied under the configured key this will be filled in for the new user as well.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)


## Changing a users platform permissions

If the permission tags found in a users token match those that have been configured for platform and cluster admin access then a user will be automatically upgraded to the given role.
For instance if the below token is supplied, and the platform is configured to create admins based off of the "superAdmin" tag then a user will be made an admin.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)


## Changing a users organization roles/membership: Adding organization management tags to organization objects

When creating or updating an organization you can provide a list of “tags” which are used in the configured jwt token claim field to signify what organizations the user is a member or admin of. Upon usage of the JWT token the system will automatically synchronize the user with the groups that share these “tags”. They can be comma delimited as shown below.

![Example of creating organization with permission tags](/developers/images/post_images/jwt-sync/create_org_perm_tags.png)

If a user shared a tag that is held in “External Admin Group” then they will become an admin of this group. If they share a tag that is held in “External Member Group” then they will become a member of this group. If they hold both they will be marked as an admin of this group.

## Changing a users organization roles/membership: JWT payload

If the permission tags found in a users token match those that have been configured for a given organization then a user will be automatically added to the organization with the given role.
For instance if the below token is supplied, and the organization is configured to add members based off of the "memberTag1" tag then a user will be made a member.

![Example payload of a JWT](/developers/images/post_images/jwt-sync/jwt_payload.png)


