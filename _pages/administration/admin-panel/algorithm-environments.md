---
categories: admin-panel
layout: article
title: Algorithm Environments
---

Algorithm environments are the runtime foundations for algorithms, and Algorithmia comes pre-packaged with [predefined base environments](/developers/algorithm-development/environments) in several languages including Scala, R, Java, and many versions of Python. Python environments are additionally differentiated by their support for specific versions of third-party libraries and ML frameworks such as TensorFlow and PyTorch, and their access to specific hardware that provides advanced computation capabilities.

Environments aren't a limitation, but rather an optimization. You can always manually specify dependencies and we'll ensure that they're available in your algorithm by pulling them down from the central repository corresponding to your language of choice (for Python algorithms, for example, we use pip to pull dependencies from PyPI). Using predefined environments streamlines the development experience on the platform. It also maximizes the platform's performance, as algorithms created with predefined environments have faster build times and faster load times from a cold start. For more details on algorithm environments and how they're intended to be used, see how to create an algorithm in our [Getting Started Guide](/developers/algorithm-development/your-first-algo).

## Listing currently installed environments

The Algorithm Environments page lists the environments that are currently installed on your cluster and available to users for creating algorithms. The details for each environment include its programming language and language version, the external libraries included, and the machine type (CPU vs. GPU).

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627578674931.png)

## Installing environments

If there are environments available that aren't currently installed, an **Add Environment** button will be displayed in the upper-right corner of the page. Click the button and search for the environment you'd like to use. When you've found the appropriate environment, select it and click the **Add Environment** button. If you need an environment that isn't listed, click the **Request an environment** link or contact your customer success manager.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627578704982.png)

Back on the landing page, the environment will now be listed and is available immediately for users to use with their algorithms.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627578754581.png)

## Using installed environments

When you create a new algorithm, all available environments are displayed as options in the **Environment** dropdown for the selected language.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627578811509.png)

When you create an algorithm, the dependencies associated with the selected environment are automatically listed in the algorithm's dependencies file. You can view this in the Web IDE by clicking the **Dependencies** button, or in the algorithm's requirements file if you're developing locally.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627584273618.png)

## Viewing environment details

From the Algorithm Environments page on the admin panel, click on the name of an environment to display additional environment-specific metadata.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1627578902716.png)

## Managing environments through the API

If you'd like to manage environments without using the browser UI, Algorithmia's API provides this functionality.

### Listing available environments

Use the following command to list the available environments on the cluster to get the `environment_specification_id` of any environment that you'd like to enable or disable. In the code sample below, this value references as `ENV_SPEC_ID`.

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/environments/available \
    -H 'Authorization: Simple|Bearer CLUSTER_ADMIN_AUTH_TOKEN'
</pre>

</div>

**REST response**

<div class="syn-code-block">

<pre class="code_snippet">[
  {
    "id": "d7e931d9-f54e-4093-bfc8-b6bc0b3c72af",
    "environment_specification_id": "02b3117b-08c3-4575-8982-a7038c139c5e",
    "display_name": "Python 3.7 + PyTorch 1.7.x",
    "description": "Python 3.7 installation with CUDA 10.1 and PyTorch 1.7.x installed",
    "created_at": "2021-04-06T22:34:20.723",
    "language": {
      "name": "python3",
      "display_name": "Python 3.x (Environments)",
      "configuration": "{\n    \"display_name\": \"Python 3.x (Environments)\",\n    \"req_files\": [\n        \"requirements.txt\"\n    ],\n    \"artifacts\": [\n        {\"source\":\"/home/algo/.local\", \"destination\":\"/home/algo/.local/\"},\n        {\"source\":\"/opt/algorithm\", \"destination\":\"/opt/algorithm/\"}\n    ]\n}\n"
    },
    "machine_type": "GPU"
  },
  ...
]
</pre>

</div>

### Enabling an environment

When an environment is enabled, it becomes available to cluster users for creating algorithms.

Use the following command to enable an environment on the cluster, replacing `ENV_SPEC_ID` with an `environment_specification_id` from the output [above](#h_10607253526161631206557854).

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/environment-specifications/ENV_SPEC_ID/syncs \
    -X POST
    -H 'Authorization: Simple|Bearer CLUSTER_ADMIN_AUTH_TOKEN'
</pre>

</div>

### Disabling an environment

When you disable an environment, it's no longer be available to cluster users for creating algorithms. If an environment is disabled, previous algorithms builds that use that environment will continue to function. Disabled environments can be enabled again in the future as shown in the previous section.

Use the following command to disable an environment on the cluster, replacing `ENV_SPEC_ID` with an `environment_specification_id` from the output [above](#h_10607253526161631206557854).

**REST request**

<div class="syn-code-block">

<pre class="code_snippet">$ curl https://CLUSTER_DOMAIN/v1/algorithm-environments/edge/environment-specifications/ENV_SPEC_ID \
    -X DELETE
    -H 'Authorization: Simple|Bearer CLUSTER_ADMIN_AUTH_TOKEN'
</pre>

</div>