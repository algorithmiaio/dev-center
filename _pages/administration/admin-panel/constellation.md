---
categories: admin-panel
layout: article
title: Constellation Distributed Serving
---

<span style="color: #843fa1; font-size: 16pt;">NOTE: This feature (and its associated documentation) is currently in **beta** and requires a separate license and fee. To learn more and to get set up using Constellation with your Algorithmia installation, please contact your customer success manager.</span>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Satellite configuration](#satellite-configuration)
  - [Creating a satellite deployment](#creating-a-satellite-deployment)
    - [Adding algorithms to a satellite](#adding-algorithms-to-a-satellite)
  - [Configuring a satellite deployment](#configuring-a-satellite-deployment)
    - [Editing a satellite's algorithms](#editing-a-satellites-algorithms)
    - [Creating a new launch instance](#creating-a-new-launch-instance)
  - [Editing a launch instance](#editing-a-launch-instance)
  - [Removing a launch instance](#removing-a-launch-instance)
- [Satellite deployment](#satellite-deployment)
- [Kubernetes configuration](#kubernetes-configuration)
- [FAQ](#faq)

## Overview

Our Constellation Distributed Serving feature provides a flexible deployment option in which an Algorithmia "mothership" development cluster has "satellite" production runtime environments, thereby decoupling the Algorithmia development experience from runtime execution.

This architecture provides for the ability to develop algorithms in a centralized location and then distribute the runtime, unlocking additional workload possibilities relative to a standard Algorithmia installation. With Constellation, you can do the following:

*   Deploy and execute algorithms behind a firewall to support high-security workloads.
*   Execute algorithms in close geographic proximity to your data to adhere to data regulatory compliance standards and to support low-latency SLAs.
*   Meet robust disaster recovery, high-availability, and business continuity requirements.
*   Create Development-to-Production algorithm promotion workflows to ensure that algorithms are tested thoroughly before supporting production workloads.
*   Execute algorithms on the edge, where and when you need them.
*   Execute algorithms periodically and in batch for workloads that don't require an entire standard Algorithmia cluster or that are only run infrequently on demand.
*   Increase operational efficiency and reduce overhead by leveraging existing infrastructure (e.g., Kubernetes).

## Satellite configuration

The **Constellation** page in the admin panel provides functionality for selecting algorithms from which to create a satellite cluster.

### Creating a satellite deployment

On the **Constellation** page you'll see a list of existing satellites.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626914678968.png)

To configure a new satellite of algorithms, click on the **New satellite** button. In the modal, provide a **Satellite name**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624479366286.png)

#### Adding algorithms to a satellite

Next, you can add algorithms by clicking the **Add an algorithm** button, and another modal will pop up for adding your algorithm information.

**Note that you'll need to have an [Admin API key](https://algorithmia.com/developers/platform/customizing-api-keys#admin-api-keys) configured in your account in order to add algorithms.**

In the **Algorithm** field you'll provide the name of the account or organization that owns the algorithm, the name of the algorithm, and the algorithm version hash (SHA-1), in the format `ALGO_OWNER/ALGO_NAME/ALGO_VERSION_HASH`.

In the **Algorithm vanity URL** field, supply a unique URL to associate with your algorithm; this enables you to specify a concise endpoint at which the algorithm can be called. For example, if you specify a vanity URL of foo/bar, the algorithm will be callable at `https://CLUSTER_DOMAIN/v1/algo/foo/bar`.

In the **Replica count** field, configure the number of algorithm replicas for the satellite.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626914547827.png)

Click **Add algorithm** and you'll see the algorithm added to the **Algorithms** section.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1626914629869.png)

Once you've filled out the **Satellite name** and added the algorithms that'll be connected to the satellite, click **Create satellite**. You'll be sent back to the **Constellation** admin page, where your newly created satellite should now be visible.

### Configuring a satellite deployment

Click on the name of an existing satellite from the Constellation admin page. On the satellite details page, you'll have the ability to [edit the algorithms in the satellite](#editing-a-satellites-algorithms), [create a new launch instance](#creating-a-new-launch-instance), and [remove a launch instance](#deleting-a-launch-instance).

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624484478899.png)

#### Editing a satellite's algorithms

To edit the list of algorithms associated with an existing satellite, click on the **gear icon** at the upper-right corner of the screen or click on the **Algorithms** tab and then the **Edit algorithms** button.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624485460383.png)

A form titled **Edit satellite** will open. The satellite's current algorithms will be listed. You can remove existing algorithms from the satellite using the **X** button to the right of an algorithm. You can add algorithms by clicking the **Add an algorithm** button and a new window will pop up for you to specify which algorithm you'd like to add. The fields to fill out are identical to those described in the [Adding algorithms to a satellite](#adding-algorithms-to-a-satellite) section above.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624479893421.png)

Click the **Save changes** button, and your satellite will be updated. Back in the satellite details page, you'll be able to view the new algorithms under the **Algorithms** tab.

Note that editing algorithms for a satellite will increment the latest satellite version.

#### Creating a new launch instance

To create a new launch instance, click on the **New launch instance** button.
Select the **Satellite version** for your new launch instance, and provide an **Instance name** and **Description**. Click **Create launch instance** and you should see your new launch instance under the **Launch instances** tab.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624485185460.png)

### Editing a launch instance

Click on the name of the launch instance you'd like to edit, and a sidesheet will open with details about your launch instance. You can also use the search functionality to find your launch instance.

Click **Edit Launch Instance** and a window will pop up that'll allow you to edit the **Satellite version**, **Instance name**, and **Description**. Click **Save changes** and you'll return to the satellite details page.

Note that updating launch instance configuration details won't automatically update any deployed instances. To do this, you'll need to re-launch those instances with the new configuration. The command to do this is provided in the upper-right corner of the sidesheet, and its usage is demonstrated in the [Satellite deployment](#satellite-deployment) section below.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624480231841.png)

### Removing a launch instance

To remove a launch instance, click on the instance name you'd like to remove. You can also use the search functionality to find the specific launch instance.

A sidesheet will open with details about your launch instance. Click the **Remove launch instance** button and a window will pop up that'll confirm your action to remove the launch instance. Click the **Remove launch instance** button and you'll return to the satellite details page.

Note that removing a launch instance will not delete the launched instance; it'll only remove the configuration from the satellite's launch instance list.

## Satellite deployment

Once a satellite has been [configured in the mothership UI](#configuring-a-satellite-deployment) as indicated above, it must be deployed to a Kubernetes cluster. See [Configuring Azure Kubernetes Service (AKS)](https://training.algorithmia.com/managing-advanced-workflows/892931) or [Configuring Amazon Elastic Kubernetes Service (EKS)](https://training.algorithmia.com/managing-advanced-workflows/892934) for provider-specific Kubernetes configuration details. To summarize, the following are required:

*   A **target** <span style="font-family: inherit; font-size: 1em;">**Kubernetes cluster**, where you must:</span>
    *   Be running Kubernetes 1.18.x
    *   Have an `IngressController` created
    *   Use Calico network policies, or ensure all inter-pod traffic is enabled
    *   Provision adequate pod space to run all pods for the satellite (5 pods for the system + N pods for your algorithms based on the number of replicas)
    *   [Enable application ingress](#kubernetes-configuration) for the environment as described below
*   A **target kubernetes namespace** within that cluster, in which objects will be created; this references below as `NAMESPACE`
*   A **kubeconfig** <span style="font-family: inherit; font-size: 1em;">file that can be used to access and create resources within that cluster; see [Connecting to an AKS cluster](https://training.algorithmia.com/managing-advanced-workflows/892931#connecting-to-an-aks-cluster) for instructions on how to obtain this using the</span> Azure CLI
*   A private **docker container registry** (and **login credentials**) to which images needed for the satellite can be pushed during installation, and from which images will be pulled during cluster operation

Once the above configuration is in place, you must launch a codex-install container (version >= 1.10.4).

*   Note that when<span style="font-weight: 400;">starting this container you must also bind-mount the Docker socket from the host with</span> `-v /var/run/docker.sock:/var/run/docker.sock`
*   Perform a `docker login` to ensure that images can be pulled from Docker Hub

*   <span style="font-weight: 400;">Images will be pulled from the registry where system images are stored</span>

*   <span style="font-weight: 400;">Perform a</span> `docker login <CONTAINER_REGISTRY_NAME>` <span style="font-weight: 400;">to ensure images can be pushed to the needed container registry</span>

<span style="font-weight: 400;">Then perform the following:</span>

*   <span style="font-weight: 400;">Identify the **Satellite ID** and **Launch ID** you want to deploy using the [Constellation admin page](#satellite-configuration)</span><span style="font-weight: 400;">. Click on the name of an existing satellite; the values are displayed as in the screenshot below.</span>

<span style="font-weight: 400;">![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1624487644396.png)</span>

*   <span style="font-weight: 400;">Using the ID values from above, run the command below. This will download artifacts like Docker images and a plan file that’ll be needed later, and store them in </span>the directory `/home/algo/deployment/current/satellite/<SATELLITE_ID>/<LAUNCH_ID>`. <span style="font-weight: 400;">These files can be quite large, so the download process may take some time.</span> Note that you'll need to run this and subsequent commands from a machine that has network access to the target Kubernetes cluster, so you may need to copy these files onto a machine that has such network access.

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> get <ADMIN_API_KEY>
</pre>

</div>

*   Next, you'll need to configure the following variables, which are specific to your deployment target:
    *   <span style="font-weight: 400;">The destination container registry where images should be pushed; note that you</span> <span style="font-weight: 400;">should also perform a</span> `docker login` <span style="font-weight: 400;">to this registry</span>

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> \
    configure stage.container_registry=<some.customer.foo:1234/registry>
</pre>

</div>

*   *   <span style="font-weight: 400;">Path to the kubeconfig file that has permission to create and read resources from the destination cluster:</span>

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> \
    configure .stage.kubernetes.kubeconfig_path=/home/algo/cust8s.conf
</pre>

</div>

*   *   The namespace into which to deploy:

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> \
    configure .stage.kubernetes.namespace=<NAMESPACE_NAME>
</pre>

</div>

*   *   <span style="font-weight: 400;">The fully qualified domain name of the mothership cluster</span>

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> \
    configure .stage.fqdn=<foo.customer.com>
</pre>

</div>

*   <span style="font-weight: 400;">Finally, launch the satellite!</span>

<div class="syn-code-block">

<pre class="code_snippet">$ algo-install satellite <SATELLITE_ID> <LAUNCH_ID> deploy
</pre>

</div>

At this point, Kubernetes resources should be created, but you may need to configure the **Kubernetes ingress** <span style="font-weight: 400;">based on the requirements of your Kubernetes cluster, cloud provider, or</span>`IngressController`<span style="font-weight: 400;">s.</span>

## Kubernetes configuration

For detailed guides on how to configure Kubernetes with appropriate network access for use with Constellation Distributed Serving, please see the respective pages for [Azure Kubernetes Service (AKS)](https://training.algorithmia.com/managing-advanced-workflows/892931) and [Amazon Elastic Kubernetes Service (EKS)](https://training.algorithmia.com/managing-advanced-workflows/892934).

## FAQ

* * *

**Q**<span style="font-family: inherit; font-size: 1em;">: Can I use different cloud platforms for the mothership cluster and the satellite clusters? For example, can I create a satellite in my mothership Algorithmia cluster that's deployed on AWS infrastructure and then deploy that satellite into an AKS environment?</span>

<div>

**A**: Yes. There's no tie between mothership and satellite, and there's nothing cloud provider-specific about satellites at this point in time.

</div>

<div>

* * *

**Q**: Where are the logs written from my satellite cluster?

**A**: It's up to you to configure your Kubernetes cluster with a log-forwarding agent if desired. Our applications log to `stdout`.

</div>