---
categories: admin-config
layout: article
title: Configure an Azure Kubernetes Service (AKS) Cluster
---

This page contains information for configuring a managed AKS cluster with the appropriate network access for use with [Constellation Distributed Serving](/developers/administration/admin-panel/constellation).

This feature (and its associated documentation) is currently in **beta**.
{: .notice-info}

This feature is only available in Algorithmia Enterprise installations.
{: .notice-enterprise}

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Creating an AKS cluster](#creating-an-aks-cluster)
- [Connecting to an AKS cluster](#connecting-to-an-aks-cluster)
- [Enabling ingress to an AKS cluster](#enabling-ingress-to-an-aks-cluster)
  - [Ingress path-matching patterns](#ingress-path-matching-patterns)

## Creating an AKS cluster

Log in to the [Azure Portal](http://portal.azure.com/) and navigate to **Kubernetes services**. Click **+ Create** and **+ Create a Kubernetes cluster** from the dropdown.

**![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628690773473.png)**

Choose a **Resource group**, **Kubernetes cluster name**, **Region**, and **Kubernetes version**. At present, only Kubernetes 1.18.x has been fully validated with Constellation, so you should select this minor version.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628691208465.png)

Click **Next: Node Pools**.

In the **Node Pools** tab, click on the **agentpool** node pool.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628691742612.png)

In the **Update node pool** form, change **Max pods per node** to 30 and click **Update**. Each node gets a number of IP addresses equal to this max pods value. The subnet size, along with max pods per node, determines how many total nodes the AKS cluster can have.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628691680959.png)

Click **Next: Authentication** and **Next: Networking**. Under **Network configuration** select **Azure CNI**, and under **Network policy** select **Calico**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628692540121.png)

Click **Next: Integrations**.

In the **Integrations** tab click **Create new** under **Container registry** to create a new container registry to hold the algorithm container images from Constellation.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628693282164.png)

Once you've created the registry, click **Review + create** to validate your configuration. When validation passes, click **Create** to provision the cluster.

Once the AKS cluster is provisioned (this may take several minutes), it's a good idea to make sure you can connect with it from the command line before continuing with configuration in the portal. The following section describes how to do this, and in the section after that we'll walk through the steps to enable ingress on the cluster to support Constellation's networking requirements.

## Connecting to an AKS cluster

To begin, you'll need to [install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) if you don't already have it locally on your system. You can check whether you have it installed, or confirm that an installation was successful, by running `az version`.

To authenticate with the CLI, run `az login` and follow the instructions in the browser window that appears.

Once you've successfully authenticated, run the following command to pull your AKS cluster's kubeconfig file to your local machine and then move it to your working directory.

<div class="syn-code-block">

<pre class="code_snippet">$ az aks get-credentials --overwrite-existing \
    --resource-group RESOURCE_GROUP_NAME --name AKS_CLUSTER_NAME
 </pre>

</div>

You'll now be able to run standard `kubectl` commands, e.g.:

<div class="syn-code-block">

<pre class="code_snippet">$ kubectl get pods -A --sort-by=.metadata.name
NAMESPACE     NAME                                                  READY   STATUS    RESTARTS   AGE
kube-system   calico-node-jv2nt                                     1/1     Running   0          67m
kube-system   calico-node-kfx8s                                     1/1     Running   0          67m
kube-system   calico-typha-deployment-5664ccf987-pjl2x              1/1     Running   0          67m
kube-system   calico-typha-horizontal-autoscaler-78dd9bb4b5-4ggzp   1/1     Running   0          67m
kube-system   coredns-77b8db5487-glnff                              1/1     Running   0          66m
kube-system   coredns-77b8db5487-plk9x                              1/1     Running   0          67m
kube-system   coredns-autoscaler-cb5bc68df-wfpxk                    1/1     Running   0          67m
kube-system   ingress-appgw-deployment-66dd8d446c-8tjk2             1/1     Running   3          58m
kube-system   kube-proxy-jk49x                                      1/1     Running   0          67m
kube-system   kube-proxy-pfx5x                                      1/1     Running   0          67m
kube-system   metrics-server-58fdc875d5-647c7                       1/1     Running   0          67m
kube-system   omsagent-mnxwd                                        1/1     Running   0          67m
kube-system   omsagent-pl8sx                                        1/1     Running   0          67m
kube-system   omsagent-rs-59b49d4f67-wps9q                          1/1     Running   0          67m
kube-system   tunnelfront-569956df56-s46jp                          1/1     Running   0          67m
</pre>

</div>

You can also query the Amazon Container Registry (ACR) service to list the registry created in the AKS configuration steps above. Note that for the account used in this demonstration, the target registry is the first item returned from listing the registries, but this may not be the case in your account.

<div class="syn-code-block">

<pre class="code_snippet">az acr list | jq '.[0].name'
"TestRegistry200811"
</pre>

</div>

## Enabling ingress to an AKS cluster

Once the AKS cluster is provisioned, navigate to the cluster and select **Networking** under **Settings** in the left-hand submenu. Select the **Enable ingress controller** option and click **Save**.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628701674663.png)

Note that a new application gateway may need to be created if an application gateway subnet isn't already configured. If this is the case, under the **Application gateway** section that appears, click **Create new** or navigate to the **Load balancing** service and click **Application gateway** and then **+ Create**.

In the **Basic** tab, select the same **Resource group** and **Region** that the AKS cluster are in. For **Virtual network** (VNet), enter the name of the VNet in which the AKS cluster is provisioned, appending `-vnet` to the end of the name.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628703837974.png)

Click **Next: Frontends** and make sure the **Frontend IP address type** is **Public**. For the **Public IP address**, select an existing address or create a new one.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628704297942.png)

Click **Next: Backends** and click **Add a backend pool** to add a virtual machine scale set (VMSS) backend pool targeting the [AKS node pool configured above](#node-pools) (for the configuration shown above in this guide, the **Target type** would be **VMSS** and the **Target** would be "agentpool").

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628704536051.png)

Click **Next: Configuration** and click **+ Add a routing rule**.

Under the **Listener** tab, configure the new routing rule with the **Frontend IP** set to **Public** and the **Port** set to the default value of 80.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628705096999.png)

Now click the **Backend targets** tab. For the **Backend target**, select your backend pool from above to specify where to send traffic.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628705513447.png)

Now click **Add new** under the **HTTP settings** field to create a new HTTP setting. Set the **Backend port** to 80 and the **Request time-out** to 3000 seconds and click **Add**. Now select select your new HTTP setting for the **HTTP settings** field and click **Add** to add the routing rule.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1628705872778.png)

Click **Next: Tags** and **Next: Review + create** to validate your configuration. When validation passes, click **Create** to provision the gateway.

Back on the command line, add the following annotation to the `execution-engine`'s `Ingress` resources:

<div class="syn-code-block">

<pre class="code_snippet">  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
</pre>

</div>

The command to do this looks like:

<div class="syn-code-block">

<pre class="code_snippet">$ kubectl edit ingress --kubeconfig=PATH_TO_kubeconfig -n NAMESPACE execution-engine
</pre>

</div>

If configured correctly, you'll see something like the following with the public IP address from the gateway:

<div class="syn-code-block">

<pre class="code_snippet">$ kubectl get ingress --kubeconfig=PATH_TO_kubeconfig -n NAMESPACE
NAME               CLASS    HOSTS    ADDRESS         PORTS   AGE
execution-engine   &lt;none&gt;   *        20.85.156.122   80      14m
</pre>

</div>

### Ingress path-matching patterns

Note that the path-matching pattern for the `PathPrefix` `Ingress` type isn't a regular expression but rather complies with the following patterns:

*   `/v1/algo/*` will forward any `/v1/algo/.*` route
*   `/v1/algo/.*` will match the literal route `/v1/algo/.*`

Once you have local access to your AKS cluster and its kubeconfig file and you've enabled cluster ingress, navigate back to the [Constellation](/developers/administration/admin-panel/constellation) docs to proceed with deploying a Constellation satellite to your AKS cluster.