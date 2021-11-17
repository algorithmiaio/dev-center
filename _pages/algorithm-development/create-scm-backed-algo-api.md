---
categories: algorithm-development
layout: article
title: Create an Algorithm Backed by an External SCM Provider Through the API
---

When you create an algorithm through the API, Algorithmia's internal SCM provider is used by default unless an external SCM configuration is specified explicitly. To use an external SCM provider as the source code repository host for your algorithms, a cluster admin must first set up the configuration. At a high level, the workflow looks like this:

On the cluster admin side:

1.  [Set up an external SCM configuration](/developers/administration/admin-panel/source-code-management/#creating-scm-configurations) and enable it to back algorithms (this is a one-time setup step).
2.  [List the available SCM configurations](/developers/administration/scm-config/source-code-management-bitbucket-server-api/#listing-scm-configurations) to get the `id` of the configuration of interest.

On the user side:

1.  Authorize the SCM configuration through the **Settings** tab on your account profile, under **Source Code Management**.
2.  Create an algorithm, specifying the SCM provider's `id` from above, as well as other required parameters, under the `source` parameter in the request payload.

On this page, we'll walk through the flow on the user's side only. For details on the steps that a cluster admin must take, see the links above.

## 1. Authorize an external SCM configuration

In the UI, go to your account profile and click the **Settings** tab. Scroll to the **Source Code Management** section, where you'll see a list of SCM configurations. Click **Authorize** on the entry that you'd like to authorize; this will enable that SCM configuration to host source code for new algorithms that you create using this account. A popup window will appear, and you'll need to confirm that you authorize the external service.

## 2. Create an algorithm backed by an external SCM

In order to create the algorithm, you'll need the `id` of the SCM configuration, which references in the code below as `SCM_CONFIG_ID`. A cluster admin will need to provide this value, as described above. You'll then follow the standard process for creating an algorithm, but you'll specify some additional information to indicate that you'd like the algorithm to be backed by a this specific external SCM, meaning that the source code will be hosted on the external platform and not in Algorithmia's internal SCM server.

### Checking your account's SCM authorization status

Before attempting to create your algorithm, it's a good idea to first ensure that the SCM configuration and authorization process has been completed successfully. If the request below returns `{"authorization_status":"unauthorized"}`, you'll need to re-check in the UI to ensure that you authorized the correct configuration (there may be multiple configurations on your cluster for any given SCM provider).

**REST request**

```bash
$ curl -X POST https://CLUSTER_DOMAIN/v1/scms/SCM_CONFIG_ID/token/status \
    -H 'Authorization: Simple STD_API_KEY' \
    -H 'Content-type: application/json'
```

**REST response**

```json
{
  "scm_username": "SCM_USERNAME",
  "authorization_status": "authorized",
  "scm_organizations": [
    {
      "scm_org_username": "SCM_ORG_USERNAME",
      "access_level": "MEMBER"
    }
  ]
}
```

To make sense of this response, suppose that the `SCM_CONFIG_ID` used in the request above was that of a GitHub configuration. The `scm_username` returned would be the GitHub username authorized through the Algorithmia account, and the `scm_org_username` would be the GitHub account of the organization in which the SCM configuration was created by the Algorithmia cluster admin. Also note that in the response, the string `MEMBER` is not a placeholder, but is actually the string that is returned, indicating that the user is a member of the given organization and has corresponding resource access privileges.

### Creating an algorithm

The algorithm request payload shown below has several `UPPERCASE` placeholders that you'll need to replace in your request. In particular, you'll want to make sure that you:

*   Replace the `SCM_CONFIG_ID` value with the one used above, which you've ensured is authorized on the cluster.
*   Replace the `SCM_USERNAME` value (to specify `repository_owner`) with the value returned from the request above to get the SCM authorization status.
*   For `repository_name`, you can choose whatever name makes the most sense to you. Often, it will be clearest to name the repository with the same name as the algorithm (as shown in the code below), but you have the option to name it differently if you choose. Note that you'll need to substitute `ENV_ID` with a valid `id` of an algorithm environment on you cluster. You can find an appropriate `id` value by [listing available languages and environments](/developers/algorithm-development/environments#option-b-using-rest-requests-directly).

**REST request**

```bash
$ curl https://CLUSTER_DOMAIN/v1/algorithms/ALGO_OWNER \
  -H 'Authorization: Simple STD_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "ALGO_NAME",
    "details": {
      "summary": "Summary of what algorithm does.",
      "label": "ALGO_NAME",
      "tagline": "Tag line for algorithm."
    },
    "settings": {
      "source_visibility": "closed",
      "username": "ALGO_OWNER",
      "algorithm_environment": "ENV_ID",
      "license": "apl",
      "network_access": "isolated",
      "pipeline_enabled": true
    },
    "source": {
      "repository_name": "ALGO_NAME",
      "repository_owner": "SCM_USERNAME",
      "scm": "SCM_CONFIG_ID",
      "initial_commit_message": "initial commit message"
    }
  }'
```

**REST response**

```json
{
  "id": "c6868815-1141-b894-b5e6-ba64f51d723a",
  "name": "ALGO_NAME",
  "details": {
    "label": "ALGO_NAME"
  },
  "settings": {
    "algorithm_callability": "private",
    "source_visibility": "closed",
    "package_set": "python37",
    "license": "apl",
    "network_access": "full",
    "pipeline_enabled": true,
    "insights_enabled": false,
    "algorithm_environment": "ENV_ID"
  },
  "source": {
    "scm": {
      "default": false,
      "enabled": true,
      "id": "SCM_CONFIG_ID",
      "name": "https://github.com",
      "provider": "github",
      "scm": {
        "client_id": "a72cb1fe54e43b70cdb6"
      },
      "oauth": {
        "client_id": "a72cb1fe54e43b70cdb6"
      },
      "urls": {
        "web": "https://github.com",
        "api": "https://api.github.com",
        "ssh": "ssh://git@github.com"
      }
    },
    "repository_owner": "SCM_USERNAME",
    "repository_name": "ALGO_NAME",
    "repository_https_url": "https://github.com/SCM_USERNAME/ALGO_NAME",
    "repository_ssh_url": "ssh://git@github.com:SCM_USERNAME/ALGO_NAME.git"
  },
  "resource_type": "algorithm"
}
```

Note that this is an example response for an algorithm created using GitHub as an SCM provider. If you use Bitbucket or GitLab as your provider, provider-specific parameters such as the name and associated URLs will differ.
