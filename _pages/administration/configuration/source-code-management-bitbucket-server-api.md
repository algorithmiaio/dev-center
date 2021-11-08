# Create a Bitbucket Server (build-via-API) configuration

This page contains instructions for creating a Bitbucket Server configuration so that users will have the option to select Bitbucket Server as the source code repository host for new algorithms they create.

Note that there are two types of Bitbucket Server providers you can use. With the "build-via-API" provider type described on this page, a separate API call is required for triggering an actual algorithm build after the source code is pushed to the repository's master branch. At the end of this page are example code and commands showing how to trigger a build.

See the [Bitbucket Server (build-on-checkin)](./805805) page for details on how to set up a configuration with the other provider type.

## Table of Contents

- [Create a Bitbucket Server (build-via-API) configuration](#create-a-bitbucket-server-build-via-api-configuration)
  - [Table of Contents](#table-of-contents)
  - [Bitbucket Server setup](#bitbucket-server-setup)
    - [Prerequisites](#prerequisites)
    - [Configuring server access](#configuring-server-access)
    - [Configuring a project](#configuring-a-project)
    - [Configuring SSH key authentication](#configuring-ssh-key-authentication)
    - [A note about Bitbucket Server user accounts](#a-note-about-bitbucket-server-user-accounts)
  - [Algorithmia setup](#algorithmia-setup)
    - [A note about authentication tokens](#a-note-about-authentication-tokens)
    - [Creating a Bitbucket Server SCM configuration](#creating-a-bitbucket-server-scm-configuration)
  - [Listing SCM configurations](#listing-scm-configurations)
  - [Updating SCM configurations](#updating-scm-configurations)
  - [Deleting SCM configurations](#deleting-scm-configurations)
  - [Creating Bitbucket Server-backed algorithms via API (version 1 method)](#creating-bitbucket-server-backed-algorithms-via-api-version-1-method)
      - [How to create an SSH key](#how-to-create-an-ssh-key)
  - [Triggering builds for Bitbucket Server-backed algorithms](#triggering-builds-for-bitbucket-server-backed-algorithms)

## Bitbucket Server setup

To create a Bitbucket Server SCM configuration on Algorithmia, you'll first need to configure a project and SSH key on the Bitbucket Server side, as described in this section.

### Prerequisites

1.  Bitbucket Server version >= 5.6 is required.
2.  Bitbucket Server must be set up with a valid SSL certificate.

### Configuring server access

1.  Log in to Bitbucket Server as an administrator and open the admin panel by clicking the gear icon at the upper-right corner.
2.  Open the **Server settings** tab from the options at left.
3.  Enter the **Base URL** for the Bitbucket Server instance, including the `https://` part in the string.
4.  Enable **HTTPS** and **SSH** access by checking the appropriate boxes as indicated in the screenshot below. We recommend configuring SSH on a different port than the web interface.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626195883283.png)

### Configuring a project

To configure a project within your BitBucket Server instance, click **Projects** at the upper-left corner and then **Create project** at the upper-right corner of the **Projects** page. Enter a **Project name** and **Project key** and an optional **Description**, and click **Create project**. Note that the example code on this page uses `ALGO_PROJECT` as a placeholder for the project name and `PRJ` as a placeholder for theproject key, _**which** **must be exactly 3 uppercase alphanumeric characters**_.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626211316100.png)

### Configuring SSH key authentication

In order to programmatically manage algorithm repositories on behalf of a user, you'll need to create an SSH key pair. You'll add the public key to Bitbucket Server and you'll store the private key as JSON content in a file, which you'll `POST` in algorithm build requests. SSH keys are used in algorithm creation; the [SSH key configuration steps](#how-to-create-an-ssh-key) are addressed further down on this page.

### A note about Bitbucket Server user accounts

In this flow, two different Bitbucket user roles are required. In the sample code on this page they're represented as follows:

*   `BB_PROJECT_OWNER_`{`USERNAME`/`PASSWORD`} represents a Bitbucket user account that has the right to create new repositories in a specified Bitbucket project.
*   `BB_REPO_USER_`{`USERNAME`/`PASSWORD`} represents a Bitbucket user account that's been granted read permissions to a target algorithm's Bitbucket repository.
    *   Note that Bitbucket supports [configuring SSH keys directly on a repository](#how-to-create-an-ssh-key) as opposed to attaching them to a Bitbucket user. The repository-level SSH key model may also work, but it hasn't yet been tested by Algorithmia.
    *   Note also that at present, this solution is only verified to support SSH keys created in **PKCS1 RSA PEM** format.

## Algorithmia setup

### A note about authentication tokens

The `Authorization` header displayed in the sample code on this page is listed as _`Simple|Bearer`_ to indicate that either an [API key](https://algorithmia.com/developers/platform/customizing-api-keys) or a [JSON Web Token (JWT)](https://algorithmia.com/developers/platform/jwt-authentication) can be used as an authentication token. Switching between these two authentication modes simply involves switching the `Authorization` header between `Simple` type and `Bearer` type, and providing the corresponding authentication token. All other aspects of the REST calls shown here are unaffected by this header.

In this flow, two different Algorithmia user roles are required, and the authentication tokens are represented as follows:

*   `CLUSTER_ADMIN_AUTH_TOKEN` represents either an [admin API key](https://algorithmia.com/developers/platform/customizing-api-keys#admin-api-keys) with [Management Access](https://algorithmia.com/developers/algorithm-development/algorithm-management) turned on or a JWT of a user who has cluster admin access rights on the target Algorithmia cluster.
*   `ORG_ADMIN_AUTH_TOKEN` represents either a standard (non-admin) API key with [Management Access](https://algorithmia.com/developers/algorithm-development/algorithm-management) turned on, generated by a user with admin rights to the org that owns a given algorithm, or a JWT of a user who has org admin access rights in the target org on the Algorithmia cluster.

For example, in the code [below](#creating-a-bitbucket-server-scm-configuration), for `-H 'Authorization: _Simple|Bearer_ **CLUSTER_ADMIN_AUTH_TOKEN**'` you'd use one or the other of the following commands, replacing the placeholders as appropriate:

*   *   `'-H Authorization: Simple **ADMIN_API_KEY**'`
    *   `'-H Authorization: Bearer **JSON_WEB_TOKEN**'`

### Creating a Bitbucket Server SCM configuration

After deployment of a new Algorithmia cluster, a cluster admin must create a Bitbucket Server SCM configuration. This is a one-time setup step on each cluster.

Begin by adding the code below to a file `add_bitbucket_scm.json`, making sure to first:

*   Replace `PRJ` with the three-character project key you configured on the Bitbucket Server side.
*   Replace all occurrences of `BB_SERVER_DOMAIN` under `urls` with the URL specific to your Bitbucket Server instance.
*   Replace `BB_CONFIGURED_SSH_PORT` with the SSH port number that you've configured.

Note that `"provider": "bitbucket"` here refers to Bitbucket _**Server**_. (Algorithmia also has a [Bitbucket _**Cloud**_ configuration](./807382), which would be specifically denoted by `"provider": "bitbucket**__cloud_**"`.) In the request, you'll need to replace `CLUSTER_DOMAIN` with your Algorithmia cluster-specific domain, and `**CLUSTER_ADMIN_AUTH_TOKEN**` as described [above](#a-note-about-authentication-tokens).

**Contents of `add_bitbucket_scm.json`**

<div class="syn-code-block">

<pre class="code_snippet">{
  "provider": "bitbucket",
  "scm": {
    "project_key": "**PRJ**"
  },
  "urls": {
    "web": "https://**BB_SERVER_DOMAIN**",
    "api": "https://**BB_SERVER_DOMAIN**",
    "ssh": "ssh://git@**BB_SERVER_DOMAIN**:**BB_CONFIGURED_SSH_PORT**"
  }
}
</pre>

</div>

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X POST -k https://**CLUSTER_DOMAIN**/v1/admin/scms \
    -H 'Authorization: _Simple|Bearer_ **CLUSTER_ADMIN_AUTH_TOKEN**' \
    -H 'Content-type: application/json' \
    -d @add_bitbucket_scm.json
</pre>

</div>

**REST response**

<div class="syn-code-block">

<pre class="code_snippet">{
  "default": false,
  "enabled": true,
  "id": "1234abcd-12ab-34cd-56ef-789012ghijab",
  "provider": "bitbucket",
  "scm": {
    "project_key": "PRJ"
  },
  "oauth": {
    "project_key": "PRJ"
  }
}
</pre>

</div>

The `id` value in the response will be needed in subsequent API calls; it references as `SCM_CONFIG_ID` in the sample code below. Note that the `oauth` object is required on the database side but can be safely ignored.

## Listing SCM configurations

You can use the command below to list SCM configurations on your cluster.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X GET -k https://**CLUSTER_DOMAIN**/v1/scms \
    -H 'Authorization: _Simple|Bearer_ **CLUSTER_ADMIN_AUTH_TOKEN**' \
    -H 'Content-type: application/json'
</pre>

</div>

The example response object shown below shows that in addition to the default internal SCM configuration (`"provider": "internal"`), this specific cluster currently has both a GitHub configuration (`"provider": "github"`) and a Bitbucket Server configuration (`"provider": "bitbucket"`).

**REST response**

<div class="syn-code-block">

<pre class="code_snippet">{
  "results": [
    {
      "default": true,
      "enabled": true,
      "id": "internal",
      "provider": "internal"
    },
    {
      "default": false,
      "enabled": true,
      "id": "5678efgh-12ab-34cd-56ef-789012ghijab",
      "provider": "github",
      "scm": {
        "client_id": "OTHER_PROJECT_KEY"
      },
      "oauth": {
        "client_id": "OTHER_PROJECT_KEY"
      },
      "urls": {
        "web": "http://github.com",
        "api": "http://api.github.com",
        "ssh": "ssh://git@github.com"
      }
    },
    {
      "default": false,
      "enabled": true,
      "id": "1234abcd-12ab-34cd-56ef-789012ghijab",
      "provider": "bitbucket",
      "scm": {
        "client_id": "PRJ"
      },
      "oauth": {
        "client_id": "PRJ"
      },
      "urls": {
        "web": "https://bb.CLUSTER_DOMAIN",
        "api": "https://bb.CLUSTER_DOMAIN",
        "ssh": "ssh://git@bb.CLUSTER_DOMAIN:8000"
      }
    }
  ]
}
</pre>

</div>

## Updating SCM configurations

You can update an SCM configuration's `enabled` status and its associated `urls`. Begin by adding the code below to a file `patch_scm_config.json`. In this file, make sure to:

*   Replace all occurrences of `NEW_BB_SERVER_DOMAIN` under `urls` with the updated URL specific to your Bitbucket Server instance.
*   Replace `BB_CONFIGURED_SSH_PORT` with the SSH port number that you've configured.

Note that:

*   You can update the `enabled` status, the `urls` object, or both at the same time.
*   The `enabled` field can only be set to `false` if the SCM configuration is **_NOT_** the default.
*   The `urls` field must contain valid values for all three nested fields.

**Contents of `patch_scm_config.json`**

<div class="syn-code-block">

<pre class="code_snippet">{
  "enabled": true,
  "urls": {
    "web": "https://**NEW_BB_SERVER_DOMAIN**",
    "api": "https://**NEW_BB_SERVER_DOMAIN**",
    "ssh": "ssh://git@**NEW_BB_SERVER_DOMAIN**:**BB_CONFIGURED_SSH_PORT**"
  }
}
</pre>

</div>

In the following command, make sure to:

*   Replace `SCM_CONFIG_ID` with the configuration's `id` value, which you can retrieve by [listing SCM configurations](#listing-scm-configurations).
*   Provide a valid admin API key or token as described above in the [Authentication approaches](#authentication-approaches) section.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X PATCH https://**CLUSTER_DOMAIN**/v1/admin/scms/**SCM_CONFIG_ID** \
    -H 'Authorization: _Simple|Bearer_ **CLUSTER_ADMIN_AUTH_TOKEN**' \
    -H 'Content-type: application/json' \
    -d @patch_scm_config.json
</pre>

</div>

## Deleting SCM configurations

You can delete an SCM configuration that you no longer want on your cluster. In order for the deletion to be successful, the SCM configuration must first be disabled so that users can't choose it as the source code repository host for new algorithms. See [Updating SCM configurations](#updating-scm-configurations) for instructions on how disable an SCM. If you get a `4040 Unable to delete SCM configuration` error, the SCM configuration probably hasn't been properly disabled.

In the following command, make sure to:

*   Replace `SCM_CONFIG_ID` with the configuration's `id` value, which you can retrieve by [Listing SCM configurations](#listing-scm-configurations).
*   Provide a valid admin API key or token as described above in the [Authentication approaches](#authentication-approaches) section.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X DELETE https://**CLUSTER_DOMAIN**/v1/admin/scms/**SCM_CONFIG_ID** \
    -H 'Authorization: _Simple|Bearer_ **CLUSTER_ADMIN_AUTH_TOKEN**' \
    -H 'Content-type: application/json'
</pre>

</div>

## Creating Bitbucket Server-backed algorithms via API (version 1 method)

To create an algorithm through the API, begin by adding your algorithm metadata to a file `create_algo_on_bitbucket.json`. In this file, make sure to:

*   Replace both instances of `ALGO_NAME` with the name of your algorithm.
*   Replace `ENV_ID` with the `id` of an environment on your cluster; this will be a UUID like `d1ec135c-4a4d-4e83-9a82-38f5699b4522`. For details on how to get this `id` value, see the docs for [listing available languages and environments](/developing-python-algorithms-in-a-local-ide/855746#listing-algorithm-languages). Note that the target value here is the `id`, not the `environment_specification_id` that you'd use for downloading the algorithm template itself.
*   Replace the `SCM_CONFIG_ID` value under `scm` with the `id` value of an existing SCM configuration, which you can retrieve by [listing SCM configurations](#listing-scm-configurations).
*   Replace the `BB_PROJECT_OWNER_USERNAME`/`BB_PROJECT_OWNER_PASSWORD` values under `scmsCredentials` with the username and password from the Bitbucket Server account used to set up the Bitbucket Server project.

**Contents of `create_algo_on_bitbucket.json`**

<div class="syn-code-block">

<pre class="code_snippet">{
  "name": "**ALGO_NAME**",
  "details": {
    "summary": "**Summary of what your algorithm does.**",
    "label": "**ALGO_NAME**",
    "tagline": "**Tag line for your algorithm.**"
  },
  "settings": {
    "source_visibility": "open",
    "username": "**ALGO_OWNER**",
    "algorithm_environment": "**ENV_ID**",
    "license": "apl",
    "network_access": "isolated",
    "pipeline_enabled": true
  },
  "source": {
    "scm": "**SCM_CONFIG_ID**",
    "initial_commit_message":"**your commit message**"
  },
  "scmsCredentials": {
    "username": "**BB_PROJECT_OWNER_USERNAME**",
    "password": "**BB_PROJECT_OWNER_PASSWORD**"
  }
}
</pre>

</div>

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X POST -k https://**CLUSTER_DOMAIN**/v1/algorithms/**ALGO_OWNER** \
    -H 'Authorization: _Simple|Bearer_ **ORG_ADMIN_AUTH_TOKEN** \
    -H 'Content-type: application/json' \
    -d @create_algo_on_bitbucket.json
</pre>

</div>

**REST response**

<div class="syn-code-block">

<pre class="code_snippet">{
  "id": "d1ec135c-4a4d-4e83-9a82-38f5699b4522",
  "name": "ALGO_NAME",
  "details": {
    "summary": "Summary of what your algorithm does.",
    "label": "ALGO_NAME",
    "tagline": "Tag line for your algorithm."
  },
  "settings": {
    "algorithm_callability": "private",
    "source_visibility": "open",
    "language": "python3-1",
    "environment": "cpu",
    "license": "apl",
    "network_access": "isolated",
    "pipeline_enabled": true,
    "insights_enabled": false,
    "algorithm_environment": "61c5a799-f7d6-4a79-bed9-5acd37463e34"
  },
  "source": {
    "scm": {
      "default": false,
      "enabled": true,
      "id": "1234abcd-12ab-34cd-56ef-789012ghijab",
      "provider": "bitbucket",
      "scm": {
        "client_id": "PRJ"
      },
      "oauth": {
        "client_id": "ALGO_PROJECT"
      },
      "urls": {
        "web": "https://bb.CLUSTER_DOMAIN",
        "api": "https://bb.CLUSTER_DOMAIN",
        "ssh": "ssh://git@bb.CLUSTER_DOMAIN:7999"
      }
    },
    "repository_owner": "ALGO_PROJECT",
    "repository_name": "ALGO_NAME",
    "repository_https_url": "https://bb.CLUSTER_DOMAIN/ALGO_PROJECT/ALGO_NAME",
    "repository_ssh_url": "ssh://git@bb.CLUSTER_DOMAIN:8000:ALGO_PROJECT/ALGO_NAME.git" },
  },
  "resource_type": "algorithm"
}
</pre>

</div>

The response object will contain an `id` value for the newly created algorithm. In subsequent calls to trigger a build of this existing algorithm, this value references as `ALGO_ID`.

After a <span style="font-family: inherit; font-size: 1em;">successful API request to create the algorithm, a new repository will be created in Bitbucket with the template file content for the selected algorithm environment. The following steps should be taken directly in Bitbucket for a newly created repository:</span>

1.  Configure a Bitbucket user (`BB_REPO_USER_USERNAME`) with write permissions to the repository, ensuring that the user has an SSH key associated with it in Bitbucket. Alternatively, you may try configuring an SSH key on the new repository itself; this repository-level SSH key model may work, but it hasn't yet been tested by Algorithmia. For details on how to create an SSH key, see [below](#how-to-create-an-ssh-key).
2.  Commit the algorithm source files into the Bitbucket repository for the algorithm.
3.  Identify the commit hash in Bitbucket that represents the commit to use in the API request to trigger an algorithm build (shown [below](#triggering-builds-for-bitbucket-server-backed-algorithms)). This references below as `BB_COMMIT_HASH` and will be a value like `6375552a3dcc208f7483f4f58f123dab0dd9c546`.

#### How to create an SSH key

Bitbucket v5.6.x supports two key types—DSA and RSA2—and the key you generate should be in **PEM** format. Note that OpenSSH keys are _**not**_ supported. In order to generate an RSA 2048-bit key on MacOS, run the following command:

<div class="syn-code-block">

<pre class="code_snippet">$ ssh-keygen -t rsa -b 2048 -m PEM -f **bb55-key**</pre>

</div>

Enter, and re-enter, a passphrase when prompted, or leave it empty. The public key will be stored in the `bb55-key.pub` file, while the private key will be stored in the `bb55-key` file.

Copy the public key to the clipboard (`pbcopy < bb55-key.pub`) and assign it to a user account or repository (on the **Repository settings** page under the **Access keys** tab).

Convert the private key to single-line format and copy it to the clipboard as shown below. The value for the private SSH key references as `SSH_KEY_VALUE` in the code [below](#triggering-builds-for-bitbucket-server-backed-algorithms).

<div class="syn-code-block">

<pre class="code_snippet">awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' **bb55-key** | pbcopy</pre>

</div>

## Triggering builds for Bitbucket Server-backed algorithms

In this API-only Bitbucket integration pattern, once you've created an algorithm and optionally pushed new commits to the repository, you'll need to manually trigger an algorithm build by calling the algorithm's `/compile` endpoint. This call can be initiated by an Algorithmia user account that's an org admin for the specific algorithm.

Note that in the REST request in **Option A**, below, the algorithm UUID (`ALGO_ID`) value is the `id` value in the response from the [create algorithm](#creating-bitbucket-server-backed-algorithms-via-api) API call. It can also be looked up using the following route:

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://api.**CLUSTER_DOMAIN**/v1/algorithms/**ALGO_OWNER**/**ALGO_NAME** \
    -H 'Authorization: _Simple|Bearer_ **ORG_ADMIN_AUTH_TOKEN**'
</pre>

</div>

In a file `build_trigger.json`, formatted as shown below, paste your SSH key (`SSH_KEY_VALUE`) and the commit SHA (`BB_COMMIT_HASH`, see [above](#bb-commit-hash)) for the target algorithm. Note that the [SSH key should be in single-line format](#how-to-create-an-ssh-key) as shown in the commands above. Once this file is ready, use either **option A** or **option B** to build the algorithm. On success, an empty response body will be returned with a `202` status code to indicate that the request has been accepted for processing.

**Contents of `build_trigger.json` **

<div class="syn-code-block">

<pre class="code_snippet">{
  "sshPrivateKey": "-----BEGIN RSA PRIVATE KEY-----\n**SSH_KEY_VALUE**\n-----END RSA PRIVATE KEY-----\n",
  "commitSha": "**BB_COMMIT_HASH**"
}
</pre>

</div>

**REST request (option A: using algorithm UUID)**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X POST -k https://api.**CLUSTER_DOMAIN**/v1/algorithms/**ALGO_ID**/compile \
    -H 'Authorization: Simple|Bearer **ORG_ADMIN_AUTH_TOKEN**'
    -H 'Content-type: application/json' \
    -d @build_trigger.json
</pre>

</div>

**REST request (option B: using algorithm owner and name in place of algorithm UUID)**

<div class="syn-code-block">

<pre class="code_snippet">$ curl -X POST -k https://api.**CLUSTER_DOMAIN**/v1/algorithms/**ALGO_OWNER**/**ALGO_NAME**/compile \  
    -H 'Authorization: Simple|Bearer **ORG_ADMIN_AUTH_TOKEN**'
    -H 'Content-type: application/json' \
    -d @build_trigger.json
</pre>

</div>